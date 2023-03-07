import { Module } from '@nestjs/common';
import { FileController } from 'src/controllers/file.controller';
import { DatabaseModule } from 'src/database/database.module';
import { batchProviders } from 'src/providers/batch.providers';
import { keywordProviders } from 'src/providers/keyword.providers';
import { FileService } from 'src/services/file.service';
import { ScraperService } from 'src/services/scraper.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CronService } from 'src/services/cron.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [DatabaseModule, EventEmitterModule.forRoot(), ScheduleModule.forRoot(),],
  controllers: [FileController],
  providers: [...batchProviders, ...keywordProviders, FileService, ScraperService, CronService],
})
export class FileModule {}
