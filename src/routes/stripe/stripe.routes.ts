import { Router } from 'express';
import { getRepository } from 'typeorm';
import * as Stripe from 'stripe';

import { CheckJwt } from '../../middleware';

const stripeRoutes = Router();
const stripe = require('stripe')('sk_test_v666XmnGJcP1Oz3GBg2iFmvd004Q3qp4jZ');

stripeRoutes.use('/subscribe', CheckJwt());
stripeRoutes.use('/subscribe', async (req, res) => {
    try {
        stripe.

        const customer = await stripe.customers.create({
            payment_method: '',
            email: '',
            invoice_settings: {
                default_payment_method: '',
            },
            source: req.body.token,
        });
        const parent = await getRepository(Parent).save({ id as stripeId});
        res.status(201).json({message: 'parent successfully registered as customer'})
    } catch (err) {
        res.status(500).json(err.toString());
    }
});




export { stripeRoutes };
