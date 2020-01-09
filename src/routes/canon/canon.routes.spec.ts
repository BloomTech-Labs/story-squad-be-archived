import * as request from 'supertest';
import * as express from 'express';
import * as dotenv from 'dotenv';

import { globalMiddleware } from '../../middleware';
import { canonRoutes } from './canon.routes';
// import * as A from '../../database/entity/Canon'
// import * as B from '../../util/typeorm-connection'

dotenv.config();

import typeorm = require('typeorm');

const app = express();
globalMiddleware(app);
app.use('/canon', canonRoutes);

typeorm.getRepository = jest.fn().mockReturnValue({
    findOne: jest
        .fn()
        .mockImplementation((id: number) =>
            Promise.resolve(id == 1 ? { base64: 'pdf', week: 1 } : undefined)
        ),
    save: jest.fn().mockImplementation((obj) => Promise.resolve(obj)),
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

    it('should return 400 with incorrect body', async () => {
        await request(app)
            .post('/canon')
            .send({ base64: 'pdf', week: undefined })
            .expect(400);
    });
});
