import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appEnv } from 'src/configs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: '*',
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(appEnv.APP_PORT || 5000);
}
bootstrap();
