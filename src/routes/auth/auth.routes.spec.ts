import * as request from 'supertest';
import * as express from 'express';

import { getRepository, createConnection } from 'typeorm';

import { globalMiddleware } from '../../middleware';
import { Parent } from '../../database/entity/Parent';
import { authRoutes } from './auth.routes';

const app = express();
globalMiddleware(app);
app.use('/auth', authRoutes);

beforeAll(async () => {
    await createConnection('testing');
});

beforeEach(async () => {
    const repo = getRepository(Parent, 'testing');
    await repo.clear();

    const seed = new Parent();
    seed.username = 'Test@gmail.com';
    seed.password = '$2b$10$Hb9cjpL3DQGfn37705j5gu3vHJfgiTuS15U45NvYJhNzmoOmm/OdS';
    await repo.save(seed);
});

describe('POST /login', () => {
    it('should return 200 Okay', async () => {
        await request(app)
            .post('/auth/login')
            .send({ username: 'Test@gmail.com', password: 'Test1234' })
            .expect(200);
    });
});

describe('POST /register', () => {
    it('POST should return 201 Created when registration is completed', async () => {
        await request(app)
            .post('/auth/register')
            .send({ username: 'NewTest@gmail.com', password: 'Test1234' })
            .expect(201);
    });
});
