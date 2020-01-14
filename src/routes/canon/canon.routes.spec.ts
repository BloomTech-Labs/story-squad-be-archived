import * as request from 'supertest';
import * as express from 'express';

import { canonRoutes } from './canon.routes';

import typeorm = require('typeorm');

typeorm.getRepository = jest.fn().mockReturnValue({
    find: jest.fn().mockResolvedValue([]),
    findOne: jest
        .fn()
        .mockImplementation(async (id: number) =>
            id == 1 ? { base64: 'pdf', week: 1 } : undefined
        ),
    save: jest.fn().mockImplementation(async (obj) => obj),
});

const app = express();
app.use('/canon', express.json(), canonRoutes);

describe('GET /canon', () => {
    it('should return 200', async () => {
        await request(app)
            .get('/canon')
            .expect(200);
    });
});

describe('GET /canon/:id', () => {
    it('should return 200 with correct week', async () => {
        await request(app)
            .get('/canon/1')
            .expect(200);
    });

    it('should return 404 with incorrect week', async () => {
        await request(app)
            .get('/canon/2')
            .expect(404);
    });
});

describe('POST /canon', () => {
    it('should return 201 when pdf is created', async () => {
        await request(app)
            .post('/canon')
            .send({ week: 1, base64: 'pdf' })
            .expect(201);
    });
});
