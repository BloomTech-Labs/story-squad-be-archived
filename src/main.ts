import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';

import * as helmet from 'helmet';
import * as compression from 'compression';

import { port } from '@environment';
import { JWTGuard } from '@app/features/auth/jwt/jwt.guard';

import { AppModule } from './app/app.module';

const bootstrap = async (): Promise<void> => {
  const fastify = new FastifyAdapter({ bodyLimit: 10048576 });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastify);
  app.enableCors();

  app.use(helmet());
  app.use(compression());

  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new JWTGuard(reflector));

  await app.listen(port, '0.0.0.0');
  console.log(`Listening on port ${port}`);
};

bootstrap();
