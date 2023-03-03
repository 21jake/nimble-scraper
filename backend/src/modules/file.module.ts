import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { batchProviders } from 'src/providers/batch.providers';
import { keywordProviders } from 'src/providers/keyword.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [...batchProviders, ...keywordProviders],
})
export class FileModule {}
