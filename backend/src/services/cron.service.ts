import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { appEnv } from 'src/configs/config';
import { Batch } from 'src/entities/batch.entity';
import { Keyword } from 'src/entities/keyword.entity';
import { Repositories } from 'src/utils/enums/repositories.enum';
import { Repository } from 'typeorm';
import { FileService } from './file.service';
import { ScraperService } from './scraper.service';

@Injectable()
export class CronService {
  constructor(
    @Inject(Repositories.KEYWORD_REPOSITORY)
    private keywordRepository: Repository<Keyword>,

    private scraperService: ScraperService,

    private fileService: FileService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async reScrape() {
    /**
     * Get {CRON_RESCRAPE_SIZE} oldest keywords that
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
      .take(10)
      .getMany();

    if (!keywords.length) return;
    console.log(`Cron service found ${keywords.length} kws...`);
    console.log({ keywords });

    await this.scraperService.scrapeKeywords(keywords);
  }
}
