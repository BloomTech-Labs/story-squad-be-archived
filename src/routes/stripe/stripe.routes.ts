import { Router } from 'express';
import * as Stripe from 'stripe';

import { CardDTO } from '../../models';
import { Parent, Child } from '../../database/entity';
import { Only } from '../../middleware';

const stripe = new Stripe(process.env.STRIPE_API || 'sk_test_v666XmnGJcP1Oz3GBg2iFmvd004Q3qp4jZ');
const stripeRoutes = Router();

stripeRoutes.get('/cards', Only(Parent), async (req, res) => {
    try {
        const user = req.user as Parent;

        const { data } = await stripe.customers.listSources(user.stripeID, { object: 'card' });

        const cards: CardDTO[] = data.map(({ id, name, brand, last4, exp_month, exp_year }) => ({
            id,
            name,
            brand,
            last4,
            exp_month,
            exp_year,
        }));
        res.json({ cards });
    } catch (err) {
        res.status(500).json({ message: 'Could not fetch cards' });
    }
});

stripeRoutes.post('/cards', Only(Parent), async (req, res) => {
    try {
        const user = req.user as Parent;
        await stripe.customers.createSource(user.stripeID, { source: req.addCard.id });
        res.status(201).json({ message: 'Successfully added payment information' });
    } catch (err) {
        res.status(500).json({ message: 'Could not update payment information' });
    }
});

stripeRoutes.delete('/cards/:id', Only(Parent), async (req, res) => {
    try {
        const user = req.user as Parent;
        await stripe.customers.deleteSource(user.stripeID, req.params.id);
        res.json({ message: 'Successfully deleted payment information' });
    } catch (err) {
        res.status(500).json({ message: 'Could not delete payment information' });
    }
});

// The plan id used here is for the 'test plan' in our Stripe account
stripeRoutes.post('/subscribe', Only(Parent), async (req, res) => {
    console.log('body', req.body);
    try {
        const plans = {
            monthly: 'plan_GVQ796LiwZugJ9',
        };
        const { child, subPlan } = req.body;
        const user = req.user as Parent;
        await stripe.customers.createSubscription(user.stripeID, {
            items: [{ plan: 'plan_GVQ796LiwZugJ9' }],
            expand: ['latest_invoice.payment_intent'],
        });
        res.status(201).json({ message: 'Successfully subscribed' });
    } catch (err) {
        res.status(500).json({ message: 'Could not process subscription' });
    }
});

export { stripeRoutes };
