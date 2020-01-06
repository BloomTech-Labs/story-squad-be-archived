import * as request from 'supertest';
import * as express from 'express';
import * as dotenv from 'dotenv';

import { globalMiddleware } from '../../middleware';
import { authRoutes } from './auth.routes';

dotenv.config();

import typeorm = require('typeorm');

const app = express();
globalMiddleware(app);
app.use('/auth', authRoutes);

typeorm.getRepository = jest.fn().mockReturnValue({
    find: jest.fn().mockResolvedValue([
        {
            username: 'Test@mail.com',
            password: '$2a$10$wOMxfPlKxunOi9ZqQ1ND9eJC4frWYmCaMRMaM.GESdvn8NR.c2FBq',
        },
    ]),
    save: jest.fn().mockResolvedValue({
        username: 'NewTest@gmail.com',
        password: '$2a$10$wOMxfPlKxunOi9ZqQ1ND9eJC4frWYmCaMRMaM.GESdvn8NR.c2FBq',
    }),
});

describe('POST /login', () => {
    it('should return 200 when logging in correctly', async () => {
        await request(app)
            .post('/auth/login')
            .send({ username: 'Test@mail.com', password: 'Test1234' })
            .expect(200);
    });

    it('should return 401 when login fails', async () => {
        await request(app)
            .post('/auth/login')
            .send({ username: 'Test@mail.com', password: 'WRONG' })
            .expect(401);
    });
});

describe('POST /register', () => {
    it('should return 201 when registration is completed', async () => {
        await request(app)
            .post('/auth/register')
            .send({ username: 'NewTest@gmail.com', password: 'Test1234', termsOfService: true })
            .expect(201);
    });

    it('should return 401 if termsOfService are not accepted', async () => {
        await request(app)
            .post('/auth/register')
            .send({ username: 'NewerTest@gmail.com', password: 'Test1234', termsOfService: false })
            .expect(401);
    });
});
