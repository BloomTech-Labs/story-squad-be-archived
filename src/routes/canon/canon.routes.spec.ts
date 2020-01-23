import * as request from 'supertest';
import * as express from 'express';
import { plainToClass } from 'class-transformer';

import { Admin, Canon } from '../../database/entity';

import { canonRoutes } from './canon.routes';

const admin: Admin = plainToClass(Admin, {
    id: 1,
    email: 'test@mail.com',
    password: 'I Am Password',
    role: 'admin',
    validpass: true,
});

const moderator: Admin = plainToClass(Admin, {
    id: 2,
    email: 'test2@mail.com',
    password: 'I Am Password',
    role: 'moderator',
    validpass: true,
});

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

jest.mock('../../middleware', () => ({
    Only: () => (req, res, next) => {
        next();
    },
}));

const CheckJwt = () => (req, res, next) => {
    if (req.headers.authorization === 'admin') req.user = admin;
    if (req.headers.authorization === 'moderator') req.user = moderator;
    next();
};

const app = express();
app.use('/canon', express.json(), CheckJwt(), canonRoutes);

describe('GET /canon', () => {
    it('should return 200', async () => {
        await request(app)
            .get('/canon')
            .set({ Authorization: 'admin' })
            .expect(200);
    });

    it('should return 401 for non Admin', async () => {
        await request(app)
            .get('/canon')
            .set({ Authorization: 'moderator' })
            .expect(401);
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
            .set({ Authorization: 'admin' })
            .expect(201);
    });

    it('should return 401 for non Admin', async () => {
        await request(app)
            .get('/canon')
            .set({ Authorization: 'moderator' })
            .expect(401);
    });
});
