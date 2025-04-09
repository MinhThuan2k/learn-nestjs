import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import qs from 'qs';

import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { VersioningType } from '@nestjs/common';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import { setupSwagger } from '@/config/setupSwagger';
import { ErrorLoggerException } from '@/exception/ErrorLoggerException';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      querystringParser: (str) => qs.parse(str),
    }),
  );

  await app.register(fastifyCsrfProtection);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI, // API: /v1/auth, /v2/auth
  });
  app.useGlobalFilters(new ErrorLoggerException());

  dotenv.config();
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
