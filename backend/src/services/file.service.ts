import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  MessageEvent,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { readFileSync } from 'fs';
import * as path from 'path';
import { fromEvent, interval, map, Observable, Subject, switchMap } from 'rxjs';
import { appEnv } from 'src/configs/config';
import { Batch } from 'src/entities/batch.entity';
import { Keyword } from 'src/entities/keyword.entity';
import { User } from 'src/entities/user.entity';
import { ErrorResponses } from 'src/utils/enums/error-response.enum';
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
    });

    return await this.keywordRepository.save(newEntities);
  }

  async streamBatchDetail(batchId: string, user: User) {
    const batch = await this.batchRepository.findOne({
      where: { id: Number(batchId) },
      relations: ['uploader'],
    });

    if (!batch) {
      throw new BadRequestException(ErrorResponses.RECORD_NOT_FOUND);
    }
    if (batch.uploader.id !== user.id) {
      throw new ForbiddenException(ErrorResponses.INVALID_CREDENTIALS);
    }

    const total = await this.keywordRepository.count({ where: { batch: { id: batch.id } } });

    return interval(appEnv.DELAY_BETWEEN_CHUNK_MS).pipe(
      switchMap(async (_) => {
        const keywords = await this.keywordRepository.find({
          where: { batch: { id: batch.id } },
          order: { success: 1, createdDate: 'ASC' },
        });
        return {
          data: {
            total,
            keywords,
          },
        };
      }),
    );
  }
}