import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '@app/app.module';
import { JWTGuard } from '@features/auth/jwt/jwt.guard';
import { clean, seed, disconnect, adminJWT, childJWT, parentJWT } from '@seed/utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const reflector = app.get(Reflector);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalGuards(new JWTGuard(reflector));

    await app.init();
    await clean();
    await seed();
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
  });

  describe('/auth/register (POST)', () => {
    it('should return a JWT', async () => {
      const jwtCheck = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'new@storysquad.com', password: 'testing1234', termsOfService: true })
        .expect(201)
        .expect(jwtCheck);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should return a JWT', async () => {
      const jwtCheck = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@storysquad.com', password: 'testing1234' })
        .expect(201)
        .expect(jwtCheck);
    });

    it('should fail if the password is wrong', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'WRONG' })
        .expect(401);
    });
  });

  describe('/parents/me (GET)', () => {
    it('should fail if not signed in', async () => {
      await request(app.getHttpServer())
        .get('/parents/me')
        .expect(401);
    });

    it('should return the user info', async () => {
      await request(app.getHttpServer())
        .get('/parents/me')
        .set('Authorization', `Bearer ${parentJWT}`)
        .expect(200)
        .expect(({ body }) => delete body.id)
        .expect({ email: 'test@storysquad.com' });
    });
  });

  describe('/children (GET)', () => {
    it('should fail if not signed in', async () => {
      await request(app.getHttpServer())
        .get('/children')
        .expect(401);
    });

    it('should return an array of children', async () => {
      await request(app.getHttpServer())
        .get('/children')
        .set('Authorization', `Bearer ${parentJWT}`)
        .expect(200)
        .expect((res) => (res.body = res.body[0]))
        .expect(({ body }) => delete body.id)
        .expect(({ body }) => delete body.cohort)
        .expect(({ body }) => delete body.subscription)
        .expect({ username: 'Dragon84', grade: 3, dyslexia: false });
    });
  });
});
