import { Module } from '@nestjs/common';
import { AppController } from 'src/controllers/app.controller';
import { AppService } from 'src/services/app.service';
// import { ormConfig } from './configs/typeorm.config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth.module';
import { FileModule } from './modules/file.module';
import { UserModule } from './modules/user.module';
// import dataSource from 'src/configs/typeorm.config';

@Module({
  imports: [
    // TypeOrmModule.forRoot(ormConfig),
    DatabaseModule,
    UserModule,
    AuthModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
