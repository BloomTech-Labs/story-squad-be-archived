import * as request from 'supertest';
import * as express from 'express';
import { plainToClass } from 'class-transformer';

import { Middleware } from '../../models';
import { Admin } from '../../database/entity';
import { adminRoutes } from './admin.routes';

jest.mock('bcryptjs', () => ({
    hash: (str) => str,
    compare: (a, b) => a === b,
}));

jest.mock('jsonwebtoken', () => ({
    sign: () => 'token',
}));

const admin: Admin = plainToClass(Admin, {
    id: 1,
    email: 'test@mail.com',
    password: 'I Am Password',
    role: 'admin',
    temptoken: 'admin',
});

const moderator: Admin = plainToClass(Admin, {
    id: 2,
    email: 'test2@mail.com',
    password: 'I Am Password',
    role: 'moderator',
    temptoken: null,
});

import typeorm = require('typeorm');
typeorm.getRepository = jest.fn().mockReturnValue({
    find: jest.fn().mockResolvedValue([admin, moderator]),
    findOne: jest.fn().mockImplementation(async (arg) => {
        return [admin, moderator].find((e) => e.id == arg || e.email == arg.email);
    }),
    save: jest.fn().mockImplementation(async (admin: Admin) => ({ ...admin, id: 3 })),
    update: jest.fn().mockImplementation(async () => ({ affected: 1 })),
    delete: jest.fn().mockImplementation(async () => ({ affected: 1 })),
});

const BodyInjection: Middleware = () => (req, res, next) => {
    if (req.path.includes('register')) res.locals.body = req.body;
    if (req.path === '/admin' && req.method === 'POST') res.locals.body = req.body;
    next();
};

jest.mock('../../middleware', () => ({
    CheckJwt: () => (req, res, next) => {
        if (req.headers.authorization === 'admin') req.user = admin;
        if (req.headers.authorization === 'moderator') req.user = moderator;
        next();
    },
    Only: () => (req, res, next) => {
        next();
    },
}));

const app = express();
app.use('/admin', express.json(), BodyInjection(), adminRoutes);

describe('GET /admin', () => {
    it('should list all admin', async () => {
        const { body } = await request(app)
            .get('/admin')
            .set({ Authorization: 'admin' });
        expect(body.admin).toHaveLength(2);
    });

    it('should return 401 for moderators', async () => {
        await request(app)
            .get('/admin')
            .set({ Authorization: 'moderator' })
            .expect(401);
    });
});

describe('GET /admin/me', () => {
    it('should return my own account without password', async () => {
        const { body } = await request(app)
            .get('/admin/me')
            .set({ Authorization: 'admin' });
        expect(body.me.id).toBe(1);
        expect(body.me.password).toBeUndefined();
    });
});

describe('GET /admin/:id', () => {
    it('should return the requested admin without password', async () => {
        const { body } = await request(app)
            .get('/admin/1')
            .set({ Authorization: 'admin' });
        expect(body.admin.id).toBe(1);
        expect(body.admin.password).toBeUndefined();
    });

    it('should return 401 for moderators', async () => {
        await request(app)
            .get('/admin/1')
            .set({ Authorization: 'moderator' })
            .expect(401);
    });

    it('should return 404 with bad id', async () => {
        await request(app)
            .get('/admin/3')
            .set({ Authorization: 'admin' })
            .expect(404);
    });
});

describe('POST /admin', () => {
    it('should return 201 for admin', async () => {
        const email = 'test3@email.com';
        const newAdmin = { email, role: 'admin' };
        await request(app)
            .post('/admin')
            .send(newAdmin)
            .set({ Authorization: 'admin' })
            .expect(201);
    });

    it('should return 401 for moderator', async () => {
        const email = 'test3@email.com';
        const newAdmin = { email, role: 'admin' };
        await request(app)
            .post('/admin')
            .send(newAdmin)
            .set({ Authorization: 'moderator' })
            .expect(401);
    });
});

describe('POST /admin/login', () => {
    it('should return a jwt', async () => {
        const { email, password } = admin;
        const { body } = await request(app)
            .post('/admin/login')
            .set({ Authorization: 'parent' })
            .send({ email, password });
        expect(body.token).toBeTruthy();
    });
});

describe('PUT /admin/register', () => {
    it('should return a jwt', async () => {
        const { body } = await request(app)
            .put('/admin/register')
            .send({ password: 'password' })
            .set({ Authorization: 'admin' });
        expect(body.token).toBeTruthy();
    });

    it('should return 401 without temptoken', async () => {
        await request(app)
            .put('/admin/register')
            .send({ password: 'password' })
            .set({ Authorization: 'moderator' })
            .expect(401);
    });
});
