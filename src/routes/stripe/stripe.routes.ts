import { Router } from 'express';
import Stripe from 'stripe';

import { CardDTO } from '../../models';
import { Parent, Child } from '../../database/entity';
import { Only } from '../../middleware';
import { getRepository } from 'typeorm';
import { connection } from '../../util/typeorm-connection';

interface CustomerSourceExtended {
    id: string;
    name: string;
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
    [key: string]: any;
}

const stripe = new Stripe(process.env.STRIPE_API, {
    apiVersion: '2019-12-03',
    typescript: true,
});
const stripeRoutes = Router();

stripeRoutes.get('/cards', Only(Parent), async (req, res) => {
    //get which is default here?
    try {
        const user = req.user as Parent;

        const cardList = await stripe.customers.listSources(user.stripeID, {
            object: 'card',
        });

        const listData = cardList.data as CustomerSourceExtended[];
        const cards: CardDTO[] = listData.map(
            ({ id, name, brand, last4, exp_month, exp_year }) => ({
                id,
                name,
                brand,
                last4,
                exp_month,
                exp_year,
            })
        );

        const customer = await stripe.customers.retrieve(user.stripeID);

        res.json({ cards, customer });
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
    try {
        const user = req.user as Parent;
        const { childID, plan } = req.subscribe;

        const childToUpdate = user.children.find((child) => child.id === childID);

        const child = { ...childToUpdate, subscription: true };

        try {
            await stripe.subscriptions.create({
                customer: user.stripeID,
                items: [{ plan }],
                expand: ['latest_invoice.payment_intent'],
            });
        } catch (err) {
            console.log('failed to create stripe subscription');
            console.log(err.toString());
            res.json({ err: err.toString() });
        }

        try {
            await getRepository(Child, connection()).update(childID, child);
        } catch (err) {
            console.log('failed to update child entity');
            console.log(err.toString());
            res.json({ err: err.toString() });
        }

        res.status(201).json({ message: 'Successfully subscribed' });
    } catch (err) {
        res.status(500).json({ message: 'Could not process subscription' });
    }
});

stripeRoutes.put('/default/:id', Only(Parent), async (req, res) => {
    try {
        const user = req.user as Parent;
        const card = req.params.id;

        await stripe.customers.update(user.stripeID, {
            default_source: card,
        });
        res.status(200).json({ message: 'Successfully updated default payment.' });
    } catch (err) {
        res.status(500).json({ message: 'Could not update default payment method' });
    }
});
export { stripeRoutes };
