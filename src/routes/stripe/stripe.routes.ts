import { Router } from 'express';
import { getRepository } from 'typeorm';
import * as Stripe from 'stripe';

import { CheckJwt } from '../../middleware';

const stripeRoutes = Router();
const stripe = new Stripe('sk_test_v666XmnGJcP1Oz3GBg2iFmvd004Q3qp4jZ');

// stripeRoutes.use('/charge', CheckJwt());
stripeRoutes.use('/charge', async (req, res) => {
    console.log(req.body);
    try {
        let { status } = await stripe.charges.create({
            amount: 2000,
            currency: 'usd',
            description: 'An example charge',
            source: req.body,
        });

        res.json({ status });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

export { stripeRoutes };
