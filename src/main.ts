import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import qs from 'qs';

import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ErrorLoggerExceptions } from './exceptions/ErrorLoggerExceptions';
import { setupSwagger } from './config/setupSwagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      querystringParser: (str) => qs.parse(str),
    }),
  );
  dotenv.config();

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI, // API: /v1/auth, /v2/auth
  });

  setupSwagger(app);

  app.useGlobalFilters(new ErrorLoggerExceptions());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
