
import { Module } from '@nestjs/common';
import { UserController } from 'src/controllers/user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from 'src/providers/user.providers';
import { UserService } from 'src/services/user.service';


@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    ...userProviders,
    UserService,
  ],
})
export class UserModule {}
