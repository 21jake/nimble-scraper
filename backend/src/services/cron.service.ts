import { Inject, Injectable } from '@nestjs/common';
import { Batch } from 'src/entities/batch.entity';
import { Keyword } from 'src/entities/keyword.entity';
import { Repositories } from 'src/utils/enums/repositories.enum';
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScraperService } from './scraper.service';
import { FileService } from './file.service';
import { appEnv } from 'src/configs/config';
import dayjs from 'dayjs';
import puppeteer, { Browser } from 'puppeteer';
import { sleep } from 'src/utils/helpers';

@Injectable()
export class CronService {
  constructor(
    @Inject(Repositories.BATCH_REPOSITORY)
    private batchRepository: Repository<Batch>,

    @Inject(Repositories.KEYWORD_REPOSITORY)
    private keywordRepository: Repository<Keyword>,

    private scraperService: ScraperService,

    private fileService: FileService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async reScrape() {
    console.log('Running cron job...');
    if (this.fileService.concurrentUploadCount >= appEnv.MAX_CONCURRENT_UPLOAD) {
      return;
    }

    /**
     * Get {CHUNK_SIZE} oldest keywords that
     *  - doesn't have a "true" success result (either failed or not yet scraped)
     *  - createdDate is older than 10 minutes (to filter out new keywords just got uploaded and already wating to be scraped)
     */

    const tenMinutesAgo = dayjs().subtract(10, 'minute').toDate();

    const entityName = 'keyword';
    const keywords = await this.keywordRepository
      .createQueryBuilder(entityName)
      .where(`${entityName}.success IS NOT true`)
      .andWhere(`${entityName}.createdDate < :tenMinutesAgo`, { tenMinutesAgo })
      .orderBy(`${entityName}.createdDate`, 'ASC')
      .take(appEnv.CHUNK_SIZE)
      .getMany();

    if (!keywords.length) return;
    console.log(`Cron service found ${keywords.length} kws...`);
    console.log({ keywords });

    const args = appEnv.IS_PROD ? ['--no-sandbox', '--disable-setuid-sandbox'] : undefined;

    const browser = await puppeteer.launch({ args, headless: false });

    await this.scraperService.handleKeywordChunk(keywords, browser);

    await sleep(1000);
    await browser.close();
  }
}
