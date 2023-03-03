import { Keyword } from 'src/entities/keyword.entity';
import { Repositories } from 'src/utils/enums/repositories.enum';
import { DataSource } from 'typeorm';

export const keywordProviders = [
  {
    provide: Repositories.KEYWORD_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Keyword),
    inject: [DataSource],
  },
];