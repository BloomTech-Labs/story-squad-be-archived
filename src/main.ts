import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { port } from '@environment';
import { JwtGuard } from '@features/auth/jwt.guard';

import { AppModule } from './app/app.module';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new JwtGuard(reflector));

  await app.listen(port);
  console.log(`Listening on port ${port}`);
};

bootstrap();
