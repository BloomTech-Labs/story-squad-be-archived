import { Router } from 'express';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import Stripe from 'stripe';

import { Parent } from '../../database/entity/Parent';
import { Hash, ValidateHash } from '../../middleware';
import { connection } from '../../util/typeorm-connection';

const authRoutes = Router();
const stripe = new Stripe('sk_test_v666XmnGJcP1Oz3GBg2iFmvd004Q3qp4jZ', {
    apiVersion: '2019-12-03',
    typescript: true,
});

authRoutes.post('/register', Hash(), async (req, res) => {
    try {
        if (!req.register.termsOfService)
            throw new Error('401: Accepting Terms of Service is Required');

        const { id: stripeID } = await stripe.customers.create({
            email: req.register.email,
        });

        const newUser: Parent = {
            ...req.register,
            stripeID,
        };

        const { id } = await getRepository(Parent, connection()).save(newUser);
        const token = sign({ parentID: id }, process.env.SECRET_SIGNATURE || 'secret');

        res.status(201).json({ token });
    } catch (err) {
        if (err.toString().includes('401')) res.status(401).json(err.toString());
        else res.status(500).json(err.toString());
    }
});

authRoutes.use('/login', ValidateHash(), async (req, res) => {
    try {
        const token = sign({ parentID: req.user.id }, process.env.SECRET_SIGNATURE || 'secret');
        res.json({ token });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

export { authRoutes };
