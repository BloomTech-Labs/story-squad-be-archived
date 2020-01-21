import * as request from 'supertest';
import * as express from 'express';
import { plainToClass } from 'class-transformer';

import { Child, Parent, Admin } from '../../database/entity';
import { Only } from './only.middleware';

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
});

const admin: Admin = plainToClass(Admin, {
    id: 1,
    email: 'test@mail.com',
    password: 'I Am Password',
    role: 'admin',
    validpass: true,
});

const CheckJwt = () => (req, res, next) => {
    if (req.headers.authorization === 'parent') req.user = parent;
    if (req.headers.authorization === 'child') req.user = child;
    if (req.headers.authorization === 'admin') req.user = admin;
    next();
};

const app = express();
app.use(express.json(), CheckJwt());

app.get('/parent', Only(Parent), (req, res) => {
    res.sendStatus(204);
});
app.get('/child', Only(Child), (req, res) => {
    res.sendStatus(204);
});
app.get('/admin', Only(Admin), (req, res) => {
    res.sendStatus(204);
});

describe('Only(Admin)', () => {
    it('should continue if user is an Admin', async () => {
        await request(app)
            .get('/admin')
            .set({ Authorization: 'admin' })
            .expect(204);
    });

    it('should return 401 if user is not an Admin', async () => {
        await request(app)
            .get('/admin')
            .set({ Authorization: 'parent' })
            .expect(401);

        await request(app)
            .get('/admin')
            .set({ Authorization: 'child' })
            .expect(401);
    });
});

describe('Only(Parent)', () => {
    it('should continue if user is a Parent', async () => {
        await request(app)
            .get('/parent')
            .set({ Authorization: 'parent' })
            .expect(204);
    });

    it('should return 401 if user is not a Parent', async () => {
        await request(app)
            .get('/parent')
            .set({ Authorization: 'admin' })
            .expect(401);

        await request(app)
            .get('/parent')
            .set({ Authorization: 'child' })
            .expect(401);
    });
});

describe('Only(Child)', () => {
    it('should continue if user is a Child', async () => {
        await request(app)
            .get('/child')
            .set({ Authorization: 'child' })
            .expect(204);
    });

    it('should return 401 if user is not a Child', async () => {
        await request(app)
            .get('/child')
            .set({ Authorization: 'admin' })
            .expect(401);

        await request(app)
            .get('/child')
            .set({ Authorization: 'parent' })
            .expect(401);
    });
});
