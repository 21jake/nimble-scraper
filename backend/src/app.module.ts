import { Module } from '@nestjs/common';
import { appEnv } from './configs/config';
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
  ]
})
export class AppModule {}
