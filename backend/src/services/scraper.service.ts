import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Batch } from 'src/entities/batch.entity';
import { Keyword } from 'src/entities/keyword.entity';
import { EmittedEvent } from 'src/utils/enums/event.enum';
import { Repositories } from 'src/utils/enums/repositories.enum';
import { HttpScraper } from 'src/utils/scraper.utils';
import { Repository } from 'typeorm';
import { FileService } from './file.service';

@Injectable()
export class ScraperService {
  constructor(
    @Inject(Repositories.KEYWORD_REPOSITORY)
    private keywordRepository: Repository<Keyword>,

    private fileService: FileService,
  ) {}

  @OnEvent(EmittedEvent.NEW_BATCH)
  async onNewBatchCreated(payload: Batch) {
    this.fileService.concurrentUploadCount++;

    const keywords = await this.keywordRepository.find({
      where: { batch: { id: payload.id } },
      select: ['id', 'name'],
    });

    await this.scrapeKeywords(keywords);
    this.fileService.concurrentUploadCount--;
  }

  async scrapeKeywords(keywords: Keyword[]) {
    for (let index = 0; index < keywords.length; index++) {
      const kw = keywords[index];
      const scraper = new HttpScraper(kw.name);
      kw.proxy = scraper.proxy.label;

      try {
        await scraper.scrape();
        const { fileName, totalAnchorLinks, adsCount, searchTime, totalResults } = scraper.getOverviewScrapedInfo();
        kw.fileName = fileName;
        kw.totalAds = adsCount;
        kw.totalLinks = totalAnchorLinks;
        kw.searchTime = searchTime;
        kw.totalResults = Number(totalResults) || null;
        kw.success = true;
      } catch (error) {
        kw.error = error.message;
        kw.success = false;
      } finally {
        const saved = await this.keywordRepository.save(kw);
        console.log({ savedKeword: saved });
      }
    }
  }
}
