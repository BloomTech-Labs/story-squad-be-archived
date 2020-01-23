import * as request from 'supertest';
import * as express from 'express';
import { plainToClass } from 'class-transformer';

import { Child, Parent, Admin } from '../../database/entity';
import { CheckJwt } from './jwt.middleware';

const parent: Parent = plainToClass(Parent, {
    id: 1,
    email: 'test@mail.com',
    password: 'I Am Password',
    children: [
        {
            id: 2,
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

const child: Child = plainToClass(Child, {
    id: 2,
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
});

const admin: Admin = plainToClass(Admin, {
    id: 3,
    email: 'test@mail.com',
    password: 'I Am Password',
    role: 'admin',
    validpass: true,
});

jest.mock('jsonwebtoken', () => ({
    verify: (token: string) => {
        switch (token) {
            case 'parent':
                return { parentID: 1 };
            case 'child':
                return { childID: 2 };
            case 'admin':
                return { adminID: 3 };
            default:
                throw Error('bad token');
        }
    },
}));

jest.mock('../../util/typeorm-connection', () => ({
    connection: () => {},
}));

const database = [parent, child, admin];

import typeorm = require('typeorm');

typeorm.getRepository = jest.fn().mockReturnValue({
    findOne: jest.fn().mockImplementation(async (id: number) => database.find((e) => e.id == id)),
});

const app = express();
app.use(express.json(), CheckJwt());

app.get('/test', (req, res) => {
    res.status(200).json(req.user);
});

describe('CheckJwt()', () => {
    it('should set req.user as parent when user is parent', async () => {
        const { body } = await request(app)
            .get('/test')
            .set({ Authorization: 'parent' });
        expect(body.id).toBe(parent.id);
    });

    it('should set req.user as child when user is child', async () => {
        const { body } = await request(app)
            .get('/test')
            .set({ Authorization: 'child' });
        expect(body.id).toBe(child.id);
    });

    it('should set req.user as admin when user is admin', async () => {
        const { body } = await request(app)
            .get('/test')
            .set({ Authorization: 'admin' });
        expect(body.id).toBe(admin.id);
    });

    it('should return 401 without authorization', async () => {
        await request(app)
            .get('/test')
            .expect(401);
    });
});
