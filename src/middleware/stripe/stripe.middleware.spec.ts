import { plainToClass } from 'class-transformer';

import { Parent } from '../../database/entity';
import { UpdateStripeRecords } from './stripe.middleware';

const typeorm = require('typeorm');
typeorm.getRepository = jest.fn().mockReturnValue({
    save: jest.fn().mockImplementation(async (user) => ({ ...user })),
});

jest.mock('stripe');
const Stripe = require('stripe');
Stripe.prototype.customers = {
    create: jest.fn().mockResolvedValue({ id: 1 }),
};

describe('UpdateStripeRecords', () => {
    it('should add stripeID if it does not exist', async () => {
        const parent = plainToClass(Parent, {
            email: 'testing@mail.com',
            password: 'testing1234',
        });

        const req: any = { user: parent };
        const res: any = () => ({
            send: jest.fn(),
        });
        const next = jest.fn();

        await UpdateStripeRecords()(req, res, next);

        expect(req.user.stripeID).toBe(1);
        expect(next).toHaveBeenCalled();
    });

    it('should not add stripeID if it does exist', async () => {
        const parent = plainToClass(Parent, {
            email: 'testing@mail.com',
            password: 'testing1234',
            stripeID: 3,
        });

        const req: any = { user: parent };
        const res: any = () => ({
            send: jest.fn(),
        });
        const next = jest.fn();

        await UpdateStripeRecords()(req, res, next);

        expect(req.user.stripeID).toBe(3);
        expect(next).toHaveBeenCalled();
    });
});
