import * as request from 'supertest';
import * as express from 'express';
import { plainToClass } from 'class-transformer';

import { Child, Submissions } from '../../database/entity';
import { submissionRoutes } from './submissions.routes';

const child: Child = plainToClass(Child, {
    id: 1,
    username: 'Sarah Lang',
    grade: 3,
    week: 1,
    parent: {
        id: 1,
        email: 'test@mail.com',
        password: 'I Am Password',
        children: undefined,
    },
    preferences: {
        dyslexia: false,
    },
    submissions: [
        { id: 1, week: 1, story: '', storyText: 'Text1', illustration: '' },
        { id: 2, week: 2, story: '', storyText: 'Text2', illustration: '' },
    ],
});

import typeorm = require('typeorm');
typeorm.getRepository = jest.fn().mockReturnValue({
    save: jest
        .fn()
        .mockImplementation(async (submission: Submissions) => ({ ...submission, id: 3 })),
    update: jest.fn().mockImplementation(async () => ({ affected: 1 })),
    delete: jest.fn().mockImplementation(async () => ({ affected: 1 })),
});

jest.mock('../../middleware', () => ({
    Only: () => (req, res, next) => {
        next();
    },
}));

const userInjection = (req, res, next) => {
    req.user = child;
    next();
};

const app = express();
app.use('/submissions', express.json(), userInjection, submissionRoutes);

describe('GET /submissions', () => {
    it("should list child's submissions", async () => {
        const { body } = await request(app).get('/submissions');
        expect(body.submissions).toHaveLength(2);
    });
});
