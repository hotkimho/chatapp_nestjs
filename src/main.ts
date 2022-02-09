import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import { Validator } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe());
  

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  await app.listen(process.env.PORT);
}

bootstrap();
