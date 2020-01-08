import { Router } from 'express';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import * as Stripe from 'stripe';

import { Parent } from '../../database/entity/Parent';
import { Hash, ValidateHash } from '../../middleware';
import { connection } from '../../util/typeorm-connection';

const authRoutes = Router();
const stripe = new Stripe('sk_test_v666XmnGJcP1Oz3GBg2iFmvd004Q3qp4jZ');

authRoutes.use('/register', Hash());
authRoutes.post('/register', async (req, res) => {
    try {
        if (!req.register.termsOfService)
            throw new Error('401: Accepting Terms of Service is Required');

        const { id } = await getRepository(Parent, connection()).save(req.register);
        const token = sign({ id }, process.env.SECRET_SIGNATURE || 'secret');

        const customer = await stripe.customers.create({
            email: req.body.token.email,
        });

        const parent = await getRepository(Parent).update(req.body.token.id, {
            stripeId: customer.id,
        });

        res.status(201).json({ token });
    } catch (err) {
        if (err.toString().includes('401')) res.status(401).json(err.toString());
        else res.status(500).json(err.toString());
    }
});

authRoutes.use('/login', ValidateHash());
authRoutes.use('/login', async (req, res) => {
    try {
        const token = sign({ id: req.user.id }, process.env.SECRET_SIGNATURE || 'secret');
        res.json({ token });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

export { authRoutes };
