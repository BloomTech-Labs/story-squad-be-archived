import { Router } from 'express';
import { getRepository } from 'typeorm';
import * as Stripe from 'stripe';

import { Parent } from '../../database/entity/Parent';

import { CheckJwt } from '../../middleware';

const stripeRoutes = Router();
const stripe = new Stripe('sk_test_v666XmnGJcP1Oz3GBg2iFmvd004Q3qp4jZ');

// ADD CUSTOMER
stripeRoutes.use('/new-customer', CheckJwt());
stripeRoutes.post('/new-customer', async (req, res) => {
    try {
        const customer = await stripe.customers.create({
            email: req.body.token.email,
        });
        const parent = await getRepository(Parent).update(req.body.token.id, {
            stripeId: customer.id,
        });

        parent
            ? res.status(201).json({ message: 'parent successfully registered as customer' })
            : res.status(404).json({ message: 'could not find parent account' });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

// ADD CARD
stripeRoutes.use('/add-card', CheckJwt());
stripeRoutes.put('/add-card', async (req, res) => {
    try {
        const customer = await stripe.customers.update(req.customer.id, {
            source: req.customer.sources.object,
        });
        customer
            ? res.status(201).json({ message: 'successfully added payment information' })
            : res.status(404).json({ message: 'could not update payment information' });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

// ADD SUBSCRIPTION
// //the plan id used here is for the 'test plan' in our Stripe account
// const subscription = await stripe.subscriptions.create({
//     customer: stripeInfo,
//     items: [{ plan: 'plan_GVQ796LiwZugJ9' }],
//     expand: ['latest_invoice.payment_intent'],
// });
export { stripeRoutes };
