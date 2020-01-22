import * as request from 'supertest';
import * as express from 'express';
import { plainToClass } from 'class-transformer';

import { AddCohortDTO, Middleware } from '../../models';
import { Child, Parent } from '../../database/entity';

import { cohortRoutes } from './cohort.routes';

import typeorm = require('typeorm');
typeorm.getRepository = jest.fn().mockReturnValue({
    findOne: jest
        .fn()
        .mockImplementation(async (id: number) =>
            id == 1 ? { id: 1, week: 1, activity: 'read' } : undefined
        ),
    save: jest.fn().mockImplementation(async (obj) => ({ id: 1, ...obj })),
});

const parent: Parent = plainToClass(Parent, {
    id: 1,
    email: 'test@mail.com',
    password: 'I Am Password',
    children: [
        {
            id: 1,
            username: 'Sarah Lang',
            grade: 3,
            week: 1,
            parent: undefined,
            preferences: undefined,
        },
    ],
});
const child: Child = plainToClass(Child, {
    id: 1,
    username: 'Sarah Lang',
    grade: 3,
    week: 1,
    parent: undefined,
    preferences: undefined,
});

const UserInjection: Middleware = () => (req, res, next) => {
    if (req.headers.authorization === 'child') req.user = child;
    if (req.headers.authorization === 'parent') req.user = parent;
    next();
};

const BodyInjection: Middleware = () => (req, res, next) => {
    req.addCohort = req?.body?.cohort;
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
});

describe('POST /cohort', () => {
    it('should start a child from the latest cohort', async () => {
        const DTO: { cohort: AddCohortDTO } = {
            cohort: { id: 1, week: 1, activity: 'something' },
        };

        const { body } = await request(app)
            .post('/cohort')
            .send(DTO)
            .set({ Authorization: 'parent' });
        expect(body.cohort.activity).toBe('something');
    });
});
