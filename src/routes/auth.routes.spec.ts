import * as request from 'supertest';
import * as express from 'express';

import * as typeorm from 'typeorm';
import * as entity from '../entity/Example';

jest.mock('typeorm', () => ({
    getRepository: () => ({
        find: () => true,
        save: () => true,
    }),
}));

jest.mock('../entity/Example', () => ({
    Example: true,
}));

import { exampleRoutes } from './example.routes';

const app = express();
app.use(exampleRoutes);

test('GET should return 200 Okay', async () => {
    await request(app)
        .get('/')
        .expect(200);
});

test('POST should return 201 Created', async () => {
    await request(app)
        .post('/')
        .expect(201);
});
