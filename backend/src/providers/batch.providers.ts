import { Batch } from 'src/entities/batch.entity';
import { Repositories } from 'src/enums/repositories.enum';
import { DataSource } from 'typeorm';

export const batchProviders = [
  {
    provide: Repositories.BATCH_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Batch),
    inject: [DataSource],
  },
];