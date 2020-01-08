import { Router } from 'express';
import { getRepository } from 'typeorm';
import * as Stripe from 'stripe';

import { Parent } from '../../database/entity/Parent';

import { CheckJwt } from '../../middleware';

const stripeRoutes = Router();
const stripe = new Stripe('sk_test_v666XmnGJcP1Oz3GBg2iFmvd004Q3qp4jZ');

stripeRoutes.use('/subscribe', CheckJwt());
stripeRoutes.use('/subscribe', async (req, res) => {
    try {
        await stripe.customers.create({
            payment_method: req.body.token.payment_method,
            email: req.body.token.email,
            invoice_settings: req.body.token.invoice_settings,
        });
        const stripeInfo = req.body;
        const parent = await getRepository(Parent).update(req.body.token.id, { stripeInfo });
        parent
            ? res.status(201).json({ message: 'parent successfully registered as customer' })
            : res.status(404).json({ message: 'could not find parent account' });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

export { stripeRoutes };
