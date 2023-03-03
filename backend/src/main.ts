import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appEnv } from 'src/configs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: '*',
    },
  });
  await app.listen(appEnv.APP_PORT || 3000);
}
bootstrap();
