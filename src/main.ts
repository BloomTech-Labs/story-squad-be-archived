import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';

import * as helmet from 'helmet';
import * as cors from 'cors';
import * as compression from 'compression';

import { port } from '@environment';
import { JwtGuard } from '@features/auth/jwt.guard';

import { AppModule } from './app/app.module';

const bootstrap = async (): Promise<void> => {
  const fastify = new FastifyAdapter({ bodyLimit: 10048576 });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastify);

  app.use(helmet());
  app.use(cors());
  app.use(compression());

  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new JwtGuard(reflector));

  await app.listen(port);
  console.log(`Listening on port ${port}`);
};

bootstrap();
