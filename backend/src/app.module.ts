import { Module } from '@nestjs/common';
import { AppController } from 'src/controllers/app.controller';
import { AppService } from 'src/services/app.service';
import { appEnv } from './configs/config';
// import { ormConfig } from './configs/typeorm.config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth.module';
import { FileModule } from './modules/file.module';
import { UserModule } from './modules/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';

// import dataSource from 'src/configs/typeorm.config';

@Module({
  imports: [
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: appEnv.HTML_CACHE_PATH,
    }),
    UserModule,
    AuthModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
