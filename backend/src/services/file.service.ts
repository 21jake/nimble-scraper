import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { readFileSync } from 'fs';
import * as path from 'path';
import { appEnv } from 'src/configs/config';
import { Batch } from 'src/entities/batch.entity';
import { Keyword } from 'src/entities/keyword.entity';
import { User } from 'src/entities/user.entity';
import { EmittedEvent } from 'src/utils/enums/event.enum';
import { Repositories } from 'src/utils/enums/repositories.enum';
import { Repository } from 'typeorm';


@Injectable()
export class FileService {
  constructor(
    @Inject(Repositories.BATCH_REPOSITORY)
    private batchRepository: Repository<Batch>,

    @Inject(Repositories.KEYWORD_REPOSITORY)
    private keywordRepository: Repository<Keyword>,

    private eventEmitter: EventEmitter2,
  ) {}

  public async saveBatch(file: Express.Multer.File, user: User) {
    const batch = new Batch();
    batch.uploader = user;
    batch.originalName = file.originalname;
    batch.fileName = file.filename;

    const newBatch = await this.batchRepository.save(batch);
    await this.saveKeywords(newBatch);

    this.eventEmitter.emit(EmittedEvent.NEW_BATCH, newBatch);
    return newBatch;
  }

  private async saveKeywords(batch: Batch) {
    const keywords = readFileSync(path.join(appEnv.CSV_PATH, batch.fileName), { encoding: 'utf-8' })
      .toString()
      .split('\n');

    const newEntities = keywords.map((keyword) => {
        const newEntity = new Keyword();
        newEntity.name = keyword;
        newEntity.batch = batch;
        return newEntity;
    })

    return await this.keywordRepository.save(newEntities);
  }
}
