import { Router } from 'express';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import Stripe from 'stripe';

import { Parent } from '../../database/entity/Parent';
import { Hash, ValidateHash } from '../../middleware';
import { connection } from '../../util/typeorm-connection';

const authRoutes = Router();
const stripe = new Stripe(process.env.STRIPE_API, {
    apiVersion: '2019-12-03',
    typescript: true,
});

authRoutes.post('/register', Hash(), async (req, res) => {
    try {
        if (!req.register.termsOfService) throw new Error('401');

        const { id: stripeID } = await stripe.customers.create({
            email: req.register.email,
        });
        // when we decide what we need name for on front-end we can pass it in instead of dummy data
        const name = 'dummyName';

        const newUser: Parent = {
            ...req.register,
            stripeID,
            name,
        };
        try {
            const { id } = await getRepository(Parent, connection()).save(newUser);
            const token = sign({ parentID: id }, process.env.SECRET_SIGNATURE || 'secret');

            res.status(201).json({ token });
        } catch (err) {
            console.log(err.toString());
            res.status(400).json({
                err: err.toString(),
                message: 'Account email already registered in system...',
            });
        }
    } catch (err) {
        if (err.toString().includes('401'))
            return res.status(401).json({
                message: 'Accepting Terms of Service is required...',
            });
        else console.log(err.toString());
        return res.status(500).json({
            message: 'Hmm... That did not work, please try again later.',
        });
    }
});

authRoutes.use('/login', ValidateHash(), async (req, res) => {
    try {
        const token = sign({ parentID: req.user.id }, process.env.SECRET_SIGNATURE || 'secret');
        res.json({ token });
    } catch (err) {
        console.log(err.toString());
        res.status(500).json({
            err: err.toString(),
            message: 'Hmm... That did not work, please try again later.',
        });
    }
});

export { authRoutes };
