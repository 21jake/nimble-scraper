import { Repositories } from 'src/enums/repositories.enum';
import { DataSource } from 'typeorm';
import { User } from 'src/entities/user.entity';

export const userProviders = [
  {
    provide: Repositories.USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DataSource],
  },
];
