import { Router } from 'express';
import * as Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API || 'sk_test_v666XmnGJcP1Oz3GBg2iFmvd004Q3qp4jZ');
const stripeRoutes = Router();

stripeRoutes.get('/cards', async (req, res) => {
    try {
        const { data } = await stripe.customers.listSources(req.user.stripeID, { object: 'card' });
        const cards = data.map((card) => ({ brand: card.brand, last4: card.last4 }));
        res.json({ cards });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Could not fetch cards' });
    }
});

// ADD CARD
stripeRoutes.post('/cards', async (req, res) => {
    try {
        await stripe.customers.createSource(req.user.stripeID, { source: req.card.id });
        res.status(201).json({ message: 'Successfully added payment information' });
    } catch (err) {
        res.status(500).json({ message: 'Could not update payment information' });
    }
});

// ADD SUBSCRIPTION
//the plan id used here is for the 'test plan' in our Stripe account
stripeRoutes.use('/subscribe', async (req, res) => {
    try {
        await stripe.customers.createSubscription(req.user.stripeID, {
            items: [{ plan: 'plan_GVQ796LiwZugJ9' }],
            expand: ['latest_invoice.payment_intent'],
        });
        res.status(201).json({ message: 'Successfully subscribed' });
    } catch (err) {
        res.status(500).json({ message: 'Could not process subscription' });
    }
});

export { stripeRoutes };
