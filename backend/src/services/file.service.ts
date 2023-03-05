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
import { SortType } from 'src/dto/base-query.dto';
import { BatchQueryDto, KeywordQueryDto } from 'src/dto/file-query.dto';
import { Batch } from 'src/entities/batch.entity';
import { Keyword } from 'src/entities/keyword.entity';
import { User } from 'src/entities/user.entity';
import { ErrorResponses } from 'src/utils/enums/error-response.enum';
import { EmittedEvent } from 'src/utils/enums/event.enum';
import { StatusQuery } from 'src/utils/enums/query.enum';
import { Repositories } from 'src/utils/enums/repositories.enum';
import { RespWrapper } from 'src/utils/response-wrapper';
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

  async getBatches(user: User, params: BatchQueryDto) {
    const { page = 0, size = 20, order = 'createdDate', sort = SortType.DESC, keyword } = params;

    const entityName = 'batch';

    const query = this.batchRepository
      .createQueryBuilder(entityName)
      .loadRelationCountAndMap(`${entityName}.keywordCount`, `${entityName}.keywords`)
      .loadRelationCountAndMap(`${entityName}.processedCount`, `${entityName}.keywords`, 'keyword', (qb) => {
        return qb.andWhere('keyword.success IS NOT NULL');
      });

    query.where(`${entityName}.uploaderId = :id`, { id: user.id });

    keyword && query.andWhere(`lower(${entityName}.originalName) LIKE :keyword`, { keyword: `%${keyword.toLowerCase()}%` });

    const [results, count] = await query
      .skip(Number(page) * Number(size))
      .take(Number(size))
      .orderBy(`${entityName}.${order}`, sort)
      .getManyAndCount();
    return new RespWrapper<Batch>(results, count);
  }

  async getKeywords(user: User, params: KeywordQueryDto) {
    const { page = 0, size = 20, order = 'createdDate', sort = SortType.DESC, keyword, status, batchId } = params;
    const entityName = 'keyword';
    const query = this.keywordRepository
      .createQueryBuilder(entityName)
      .leftJoinAndSelect(`${entityName}.batch`, 'batch')
      .where(`batch.uploaderId = :id`, { id: user.id });

    keyword && query.andWhere(`lower(${entityName}.name) LIKE :keyword`, { keyword: `%${keyword.toLowerCase()}%` });
    batchId && query.andWhere(`${entityName}.batchId = :batchId`, { batchId });

    if (status) {
      status === StatusQuery.SUCCESS && query.andWhere(`${entityName}.success IS true`);
      status === StatusQuery.FAILED && query.andWhere(`${entityName}.success IS false`);
      status === StatusQuery.PENDING && query.andWhere(`${entityName}.success IS null`);
    }

    const [results, count] = await query
      .skip(Number(page) * Number(size))
      .take(Number(size))
      .orderBy(`${entityName}.${order}`, sort)
      .getManyAndCount();
    return new RespWrapper<Keyword>(results, count);
  }
}
