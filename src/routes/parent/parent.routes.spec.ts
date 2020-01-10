import * as request from 'supertest';
import * as express from 'express';
import { plainToClass } from 'class-transformer';

import { Middleware } from '../../models';
import { Parent } from '../../database/entity';
import { parentRoutes } from './parent.routes';

const parent: Parent = plainToClass(Parent, {
    id: 1,
    email: 'test@mail.com',
    password: 'I Am Password',
    children: [
        {
            id: 1,
            username: 'Sarah Lang',
            grade: 1,
            week: 1,
            parent: undefined,
            preferences: {
                dyslexia: false,
            },
        },
    ],
});

const ParentInjection: Middleware = () => (req, res, next) => {
    req.user = parent;
    next();
};

const app = express();
app.use('/parents', ParentInjection(), parentRoutes);

describe('GET /parents/me', () => {
    it('should include the username', async () => {
        const { body } = await request(app).get('/parents/me');
        expect(body.me.email).toBe(parent.email);
    });

    it('should not include the password', async () => {
        const { body } = await request(app).get('/parents/me');
        expect(body.me.password).toBeUndefined();
    });
});
