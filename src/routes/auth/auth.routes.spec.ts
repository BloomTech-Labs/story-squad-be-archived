import * as request from 'supertest';
import * as express from 'express';
import { plainToClass } from 'class-transformer';

import { Middleware, LoginDTO, RegisterDTO } from '../../models';
import { authRoutes } from './auth.routes';

const typeorm = require('typeorm');
typeorm.getRepository = jest.fn().mockReturnValue({
    save: jest.fn().mockImplementation(async (user) => ({ ...user, id: 1 })),
    find: jest.fn().mockResolvedValue([
        {
            username: 'Test@mail.com',
            password: '$2a$10$wOMxfPlKxunOi9ZqQ1ND9eJC4frWYmCaMRMaM.GESdvn8NR.c2FBq', //Test1234
        },
    ]),
});

jest.mock('stripe');
const Stripe = require('stripe');
Stripe.prototype.customers = {
    create: jest.fn().mockResolvedValue({ id: 1 }),
};

const DTOInjector: Middleware = () => (req, res, next) => {
    req.login = plainToClass(LoginDTO, req.body);
    req.register = plainToClass(RegisterDTO, req.body);
    next();
};

const app = express();
app.use('/auth', express.json(), DTOInjector(), authRoutes);

describe('POST /login', () => {
    it('should return 200 when logging in correctly', async () => {
        await request(app)
            .post('/auth/login')
            .send({ email: 'Test@mail.com', password: 'Test1234' })
            .expect(200);
    });

    it('should return 401 when login fails', async () => {
        await request(app)
            .post('/auth/login')
            .send({ email: 'Test@mail.com', password: 'WRONG' })
            .expect(401);
    });
});

describe('POST /register', () => {
    it('should return 201 when registration is completed', async () => {
        await request(app)
            .post('/auth/register')
            .send({ email: 'NewTest@gmail.com', password: 'Test1234', termsOfService: true })
            .expect(201);
    });

    it('should return 401 if termsOfService are not accepted', async () => {
        await request(app)
            .post('/auth/register')
            .send({ email: 'NewerTest@gmail.com', password: 'Test1234', termsOfService: false })
            .expect(401);
    });
});
