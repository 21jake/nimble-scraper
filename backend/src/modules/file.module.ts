import { Module } from '@nestjs/common';
import { FileController } from 'src/controllers/file.controller';
import { DatabaseModule } from 'src/database/database.module';
import { batchProviders } from 'src/providers/batch.providers';
import { keywordProviders } from 'src/providers/keyword.providers';
import { FileService } from 'src/services/file.service';
import { ScraperService } from 'src/services/scraper.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [DatabaseModule, EventEmitterModule.forRoot(),],
  controllers: [FileController],
  providers: [...batchProviders, ...keywordProviders, FileService, ScraperService],
})
export class FileModule {}
