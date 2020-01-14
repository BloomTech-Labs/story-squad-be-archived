import * as Stripe from 'stripe';
import { getRepository } from 'typeorm';

import { Middleware } from '../../models';
import { Parent } from '../../database/entity';
import { connection } from '../../util/typeorm-connection';

const stripe = new Stripe(process.env.STRIPE_API || 'sk_test_v666XmnGJcP1Oz3GBg2iFmvd004Q3qp4jZ');
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