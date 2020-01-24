import * as request from 'supertest';
import * as express from 'express';
import { plainToClass } from 'class-transformer';

import { UpdateCohortDTO, Middleware } from '../../models';
import { Child, Parent, Admin } from '../../database/entity';

import { cohortRoutes } from './cohort.routes';

const cohorts = [{ name: 'Ted', id: 1, week: 1, activity: 'read' }];

import typeorm = require('typeorm');
typeorm.getRepository = jest.fn().mockReturnValue({
    find: jest.fn().mockImplementation(() => cohorts),
    findOne: jest
        .fn()
        .mockImplementation(async (id: number) => cohorts.find((cohort) => cohort.id === id)),
    save: jest.fn().mockImplementation(async (obj) => ({ id: 1, ...obj })),
    delete: jest.fn().mockReturnValue({ affected: 1 }),
    update: jest.fn().mockReturnValue({ affected: 1 }),
});

const child: Child = plainToClass(Child, {
    cohort: {
        id: 10,
    },
});

const UserInjection: Middleware = () => (req, res, next) => {
    if (req.headers.authorization === 'child') req.user = child;
    if (req.headers.authorization === 'parent') req.user = new Parent();
    if (req.headers.authorization === 'admin') req.user = new Admin();
    next();
};

const BodyInjection: Middleware = () => (req, res, next) => {
    req.updateCohort = req?.body?.cohort;
    next();
};

const app = express();
app.use('/cohort', express.json(), UserInjection(), BodyInjection(), cohortRoutes);

describe('GET /cohort', () => {
    it('should return 200 OK if there is a cohort', async () => {
        await request(app)
            .get('/cohort')
            .set({ Authorization: 'child' })
            .expect(200);
    });

    it('should return the ID of the current child', async () => {
        const { body } = await request(app)
            .get('/cohort')
            .set({ Authorization: 'child' });

        expect(body.cohort.id).toBe(10);
    });
});

describe('GET /cohort/list', () => {
    it('should return all cohorts', async () => {
        const { body } = await request(app)
            .get('/cohort/list')
            .set({ Authorization: 'admin' });
        expect(body.cohorts.length).toBe(cohorts.length);
    });
});

describe('POST /cohort/list', () => {
    it('should return the added cohort', async () => {
        const DTO: UpdateCohortDTO = { name: 'example' };
        const { body } = await request(app)
            .post('/cohort/list')
            .send({ cohort: DTO })
            .set({ Authorization: 'admin' });
        expect(body.cohort.name).toBe('example');
    });
});

describe('PUT /cohort/list/:id', () => {
    it('should return the updated cohort', async () => {
        const DTO: UpdateCohortDTO = { name: 'example' };
        const { body } = await request(app)
            .put('/cohort/list/1')
            .send({ cohort: DTO })
            .set({ Authorization: 'admin' });
        expect(body.cohort.name).toBe('example');
    });
});

describe('DELETE /cohort/list/:id', () => {
    it('should return 200 on valid deletions', async () => {
        await request(app)
            .delete('/cohort/list/1')
            .set({ Authorization: 'admin' })
            .expect(200);
    });
});
