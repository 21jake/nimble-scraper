import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import { appEnv } from 'src/configs/config';
import { FileController } from 'src/controllers/file.controller';
import { DatabaseModule } from 'src/database/database.module';
import { batch as testBatch, keywords as testKeywords } from 'src/database/unit-test.data';
import { Batch } from 'src/entities/batch.entity';
import { Keyword } from 'src/entities/keyword.entity';
import { batchProviders } from 'src/providers/batch.providers';
import { keywordProviders } from 'src/providers/keyword.providers';
import { CronService } from 'src/services/cron.service';
import { FileService } from 'src/services/file.service';
import { ScraperService } from 'src/services/scraper.service';
import { Repositories } from 'src/utils/enums/repositories.enum';
import { Repository } from 'typeorm';

describe('Scraper', () => {
  let scraperService: ScraperService;
  let cronService: CronService;
  let batchRepository: Repository<Batch>;
  let keywordRepository: Repository<Keyword>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule, EventEmitterModule.forRoot(), ScheduleModule.forRoot()],
      controllers: [FileController],
      providers: [...batchProviders, ...keywordProviders, FileService, ScraperService, CronService],
    }).compile();
    scraperService = moduleRef.get<ScraperService>(ScraperService);
    cronService = moduleRef.get<CronService>(CronService);

    batchRepository = moduleRef.get(Repositories.BATCH_REPOSITORY);
    keywordRepository = moduleRef.get(Repositories.KEYWORD_REPOSITORY);
  });

  /**
   * This test is carried out as follows:
   * 1. Removed any scraped data from the keywords in the test batch
   * 2. Test if scraped data is truly removed
   * 3. Scrape the batch
   * 4. Test if scraped data is added to the keywords
   *
   * Note: This test wouldn't pass if you run test:coverage
   * due to a bug described here https://github.com/istanbuljs/istanbuljs/issues/499
   */

  it('Is able to scrape a list of keywords', async () => {
    const batch = await getTestBatch();

    await resetScrapedInfoTestBatch();

    await scraperService.scrape(batch);

    const { keywords: keywordsAfterScraping } = await getTestBatch();

    keywordsAfterScraping.forEach((e) => {
      expect(e.success).toBe(true);
      expect(e.totalLinks).not.toBeNull();
      expect(e.totalAds).not.toBeNull();
      expect(e.searchTime).not.toBeNull();
      expect(e.fileName).not.toBeNull();
    });
  }, 60_000);

  it('Is able to rescrap failed keywords', async () => {
    await resetScrapedInfoTestBatch();

    const { keywords: keywordsBeforeRecraping } = await getTestBatch();

    await cronService.reScrape();

    const { keywords: keywordsAfterRecraping } = await getTestBatch();

    const successfulKwBeforeRescraping = keywordsBeforeRecraping.filter((e) => e.success);
    const successfulKwAfterRescraping = keywordsAfterRecraping.filter((e) => e.success);

    expect(successfulKwBeforeRescraping.length + appEnv.CHUNK_SIZE).toBe(successfulKwAfterRescraping.length);

    successfulKwAfterRescraping.forEach((e) => {
      expect(e.success).toBe(true);
      expect(e.totalLinks).not.toBeNull();
      expect(e.totalAds).not.toBeNull();
      expect(e.searchTime).not.toBeNull();
      expect(e.fileName).not.toBeNull();
    });

  }, 60_000);

  const resetScrapedInfoTestBatch = async () => {
    const batch = await getTestBatch();
    const keywordsWithoutScrapedInfo = batch.keywords.map((e) => {
      e.success = false;
      e.error = null;
      e.totalLinks = null;
      e.totalAds = null;
      e.totalResults = null;
      e.searchTime = null;
      e.proxy = null;
      e.fileName = null;
      return e;
    });
    await keywordRepository.save(keywordsWithoutScrapedInfo);

    let batchKeywords = await keywordRepository.find({
      where: { batch: { id: batch.id } },
    });

    batchKeywords.forEach((e) => {
      expect(e.success).toBe(false);
      expect(e.error).toBeNull();
      expect(e.totalLinks).toBeNull();
      expect(e.totalAds).toBeNull();
      expect(e.totalResults).toBeNull();
      expect(e.searchTime).toBeNull();
      expect(e.proxy).toBeNull();
      expect(e.fileName).toBeNull();
    });

    return batchKeywords;
  };

  const getTestBatch = async () => {
    const batch = await batchRepository.findOne({
      where: { originalName: testBatch.originalName },
      relations: ['keywords'],
    });
    expect(batch.keywords).toHaveLength(testKeywords.length);
    return batch;
  };
});
