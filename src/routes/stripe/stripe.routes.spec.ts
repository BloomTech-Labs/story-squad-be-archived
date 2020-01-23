import * as request from 'supertest';
import * as express from 'express';
import { plainToClass } from 'class-transformer';

import { Middleware, CardDTO, AddCardDTO, SubscribeDTO } from '../../models';
import { Parent } from '../../database/entity';
import { stripeRoutes } from './stripe.routes';

jest.mock('stripe');
const Stripe = require('stripe');
Stripe.prototype.customers = {
    update: jest.fn().mockResolvedValue({}),
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
    retrieve: jest.fn().mockImplementation(() => ({ name: 'Samuel L Jackson' })),
};

Stripe.prototype.subscriptions = {
    create: jest.fn(),
};

import typeorm = require('typeorm');
typeorm.getRepository = jest.fn().mockReturnValue({
    update: jest.fn().mockImplementation(async () => ({ affected: 1 })),
});

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
    req.subscribe = req.body as SubscribeDTO;
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
            .send({ childID: 1, plan: '' })
            .expect(201);
    });
});

describe('PUT /payment/default/:id', () => {
    it('should update the default payment', async () => {
        await request(app)
            .put('/payment/default/1')
            .send({ id: 'card_exampleID' })
            .expect(200);
    });
});
