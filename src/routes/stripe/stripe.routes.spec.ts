import * as request from 'supertest';
import * as express from 'express';
import { plainToClass } from 'class-transformer';

import { Middleware, CardDTO, AddCardDTO } from '../../models';
import { Parent } from '../../database/entity';
import { stripeRoutes } from './stripe.routes';

jest.mock('stripe');
const Stripe = require('stripe');
Stripe.prototype.customers = {
    listSources: jest.fn().mockResolvedValue({
        data: [
            {
                id: '123',
                name: 'Main',
                brand: 'Visa',
                last4: '0000',
                exp_month: 1,
                exp_year: 2001,
            },
        ],
    } as { data: CardDTO[] }),
    createSource: jest.fn().mockImplementation(() => {}),
    deleteSource: jest.fn(() => ({})),
    createSubscription: jest.fn(() => ({})),
};

const app = express();

const parent: Parent = plainToClass(Parent, {
    id: 1,
    email: 'test@mail.com',
    password: 'I Am Password',
    children: [],
    stripeID: '',
});

const ParentInjection: Middleware = () => (req, res, next) => {
    req.user = parent as Parent;
    next();
};

const DTOInjection: Middleware = () => (req, res, next) => {
    req.addCard = req.body as AddCardDTO;
    next();
};

app.use('/payment', express.json(), ParentInjection(), DTOInjection(), stripeRoutes);

describe('GET /payment/cards', () => {
    it('should return cards', async () => {
        const { body } = await request(app).get('/payment/cards');
        expect(body.cards).toHaveLength(1);
    });
});

describe('POST /payment/cards', () => {
    it('should add cards', async () => {
        await request(app)
            .post('/payment/cards')
            .send({ id: 'tos_example' })
            .expect(201);
    });
});

describe('DELETE /payment/cards/:id', () => {
    it('should delete cards', async () => {
        await request(app)
            .delete('/payment/cards/1')
            .expect(200);
    });
});

describe('POST /payment/subscribe', () => {
    it('should setup subscriptions', async () => {
        await request(app)
            .post('/payment/subscribe')
            .expect(201);
    });
});
