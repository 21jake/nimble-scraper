import { Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
// import { ormConfig } from './configs/typeorm.config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user.module';
// import dataSource from 'src/configs/typeorm.config';

@Module({
  imports: [
    // TypeOrmModule.forRoot(ormConfig),
    DatabaseModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
