import AppDataSource  from 'src/configs/typeorm.config';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: DataSource,
    useFactory: async () => {
      const dataSource = AppDataSource;
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
        return dataSource;
      } else {
        return dataSource;
      }
    },
  },
];
