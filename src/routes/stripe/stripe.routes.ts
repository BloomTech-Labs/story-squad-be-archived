import { Router } from 'express';
import { getRepository } from 'typeorm';
import * as Stripe from 'stripe';

import { Parent } from '../../database/entity/Parent';

import { CheckJwt } from '../../middleware';

const stripeRoutes = Router();
const stripe = new Stripe('sk_test_v666XmnGJcP1Oz3GBg2iFmvd004Q3qp4jZ');

// ADD CARD
stripeRoutes.use('/add-card', CheckJwt());
stripeRoutes.put('/add-card', async (req, res) => {
    try {
        const customer = await stripe.customers.update(req.customer.id, {
            source: req.customer.sources.object,
        });
        if (!customer) throw new Error('404');
        res.status(201).json({ message: 'successfully added payment information' });
    } catch (err) {
        if (err == '404') {
            res.status(404).json({ message: 'could not update payment information' });
        } else res.status(500).json(err.toString());
    }
});

// ADD SUBSCRIPTION
//the plan id used here is for the 'test plan' in our Stripe account
stripeRoutes.use('/subscribe', CheckJwt());
stripeRoutes.use('/subscribe', async (req, res) => {
    try {
        const subscription = await stripe.subscriptions.create({
            customer: req.customer.id,
            items: [{ plan: 'plan_GVQ796LiwZugJ9' }],
            expand: ['latest_invoice.payment_intent'],
        });
        if (!subscription) throw new Error('404');
        res.status(201).json({ message: 'successfully subscribed' });
    } catch (err) {
        if (err == '404') {
            res.status(404).json({ message: 'could not process subscription' });
        } else res.status(500).json(err.toString());
    }
});

export { stripeRoutes };
