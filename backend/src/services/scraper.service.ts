import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Batch } from 'src/entities/batch.entity';
import { Keyword } from 'src/entities/keyword.entity';
import { EmittedEvent } from 'src/utils/enums/event.enum';
import { Repositories } from 'src/utils/enums/repositories.enum';
import { Repository } from 'typeorm';

@Injectable()
export class ScraperService {
  constructor(
    @Inject(Repositories.BATCH_REPOSITORY)
    private batchRepository: Repository<Batch>,

    @Inject(Repositories.KEYWORD_REPOSITORY)
    private keywordRepository: Repository<Keyword>,
  ) {}

  @OnEvent(EmittedEvent.NEW_BATCH)
  async scrape(payload: Batch) {
    const keywords = await this.keywordRepository.find({ where: { batch: { id: payload.id } } });

    
  }
}
