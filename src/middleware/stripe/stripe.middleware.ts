import Stripe from 'stripe';
import { getRepository } from 'typeorm';

import { Middleware } from '../../models';
import { Parent } from '../../database/entity';
import { connection } from '../../util/typeorm-connection';

const stripe = new Stripe(process.env.STRIPE_API, {
    apiVersion: '2019-12-03',
    typescript: true,
});

const UpdateStripeRecords: Middleware = () => async (req, res, next) => {
    if (req.user instanceof Parent && !req.user.stripeID) {
        const { id } = await stripe.customers.create({
            email: req.user.email,
        });
        req.user.stripeID = id;
        await getRepository(Parent, connection()).save(req.user);
    }
    next();
};

export { UpdateStripeRecords };
