import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { chunk } from 'lodash';
import puppeteer, { Browser } from 'puppeteer';
import useProxy from 'puppeteer-page-proxy';
import { appEnv } from 'src/configs/config';
import { Batch } from 'src/entities/batch.entity';
import { Keyword } from 'src/entities/keyword.entity';
import { EmittedEvent } from 'src/utils/enums/event.enum';
import { Repositories } from 'src/utils/enums/repositories.enum';
import { sleep } from 'src/utils/helpers';
import { pickLeastUsedProxy, SinglePageManipulator } from 'src/utils/scraper.utils';
import { Repository } from 'typeorm';
import { FileService } from './file.service';


@Injectable()
export class ScraperService {
  constructor(
    @Inject(Repositories.BATCH_REPOSITORY)
    private batchRepository: Repository<Batch>,

    @Inject(Repositories.KEYWORD_REPOSITORY)
    private keywordRepository: Repository<Keyword>,

    private fileService: FileService
  ) {}

  @OnEvent(EmittedEvent.NEW_BATCH)
  async scrape(payload: Batch) {
    this.fileService.concurrentUploadCount++;

    const args = appEnv.IS_PROD ? ['--no-sandbox', '--disable-setuid-sandbox'] : undefined;

    const browser = await puppeteer.launch({args});
    const keywords = await this.keywordRepository.find({ where: { batch: { id: payload.id } }, select: ['id'] });
    const kwChunks = chunk(keywords, appEnv.CHUNK_SIZE); 

    for (let index = 0; index < kwChunks.length; index++) {

      const kwChunk = kwChunks[index];
      await this.handleKeywordChunk(kwChunk, browser);

      // To ensure the longevity of the proxies, a delay is needed between each chunk
      await sleep(appEnv.DELAY_BETWEEN_CHUNK_MS);

    }
    await browser.close();

    this.fileService.concurrentUploadCount--;

  }

  private async handleKeywordChunk(kwChunk: Keyword[], browser: Browser) {
    console.log('Working on new chunk...');

    const scrapeKeywordPromises = kwChunk.map((kw) => this.scrapeKeyword(kw.id, browser));
    await Promise.all(scrapeKeywordPromises);

    console.log('////// Done on new chunk...');
  }

  private async scrapeKeyword(keywordId: number, browser: Browser) {
    const keywordRecord = await this.keywordRepository.findOne({ where: { id: keywordId } });
    const keyword = keywordRecord.name.replaceAll(' ', '+');
    const {url: proxy, label: proxyLabel} = await pickLeastUsedProxy();
    const page = await browser.newPage();

    keywordRecord.proxy = proxyLabel;

    try {
      if (proxy) {
        await useProxy(page, proxy);
      }

      await page.waitForNetworkIdle({ timeout: appEnv.PAGE_TIMEOUT_MS });
      await page.goto(`https://www.google.com/search?q=${keyword}`, {
        waitUntil: 'domcontentloaded',
        timeout: appEnv.PAGE_TIMEOUT_MS,
      });

      // Check if request is captcha-ed
      const captcha = await page.$('form#captcha-form');
      if (captcha) {
        throw new Error('Captcha-ed');
      }

      const singlePageManipulator = new SinglePageManipulator(page);

      const fileName = await singlePageManipulator.writeToFile(keyword); 
      const totalAnchorLinks = await singlePageManipulator.getTotalAnchorLinks();
      const adsCount = await singlePageManipulator.getAdsCount();
      const { searchTime, totalResults } = await singlePageManipulator.getSearchPerf();

      keywordRecord.fileName = fileName;
      keywordRecord.totalAds = adsCount;
      keywordRecord.totalLinks = totalAnchorLinks;
      keywordRecord.searchTime = searchTime;
      keywordRecord.totalResults = Number(totalResults) || null;
      keywordRecord.success = true;
    } catch (error) {
      keywordRecord.success = false;
      keywordRecord.error = error.message;
    }

    const saved = await this.keywordRepository.save(keywordRecord);
    console.log({ savedKeword: saved });

    setTimeout(async function() {      
      await page.close();
    }, 500);
  }

}
