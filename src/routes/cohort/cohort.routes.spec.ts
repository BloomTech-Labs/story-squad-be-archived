import * as request from 'supertest';
import * as express from 'express';

import { cohortRoutes } from './cohort.routes';

import typeorm = require('typeorm');

typeorm.getRepository = jest.fn().mockReturnValue({
    findOne: jest
        .fn()
        .mockImplementation(async (id: number) =>
            id == 1 ? { id: 1, week: 1, activity: 'read' } : undefined
        ),
    save: jest.fn().mockImplementation(async (obj) => obj),
});

const app = express();
app.use('/cohort', express.json(), cohortRoutes);
describe('GET /cohort', () => {
    // it('should return 200 OK if there is a cohort', async () => {
    //     await request(app)
    //         .get('/cohort')
    //         .expect(200);
    // });
    it('should return 404 if there is no cohort', async () => {
        await request(app)
            .get('/cohort')
            .expect(404);
    });
});
