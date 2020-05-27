import { hash, compare } from 'bcryptjs';
import { Router } from 'express';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';

import { connection } from '../../util/typeorm-connection';
import { Moderator } from '../../database/entity/Moderator';
import { CheckJwt, Only } from '../../middleware';

const moderatorRoutes = Router();

moderatorRoutes.post('/login', async (req, res) => {
    try {
        const { email, password: pass } = req.body as Moderator;

        if (email === 'moderator' && pass) {
            // create default Moderator if no Moderators
            const ModeratorList = await getRepository (Moderator, connection()).find({ role: 'moderator' });
            if ( ModeratorList.length) {
                const salt: number = parseInt(process.env.SALT || '3', 10);
                const password = await hash(pass, salt);
                const data = await getRepository (Moderator, connection()).save({
                    email,
                    password,
                    role: 'moderator',
                    validpass: true,
                });
                const token = sign({ moderatorID: data.id }, process.env.SECRET_SIGNATURE || 'secret');
                res.status(200).json({ token });
                return;
            }
        }
        const data = await getRepository (Moderator, connection()).findOne({ email });
        if (!data) throw Error('401');

        if (!(await compare(pass, data.password))) throw Error('401');

        const token = sign({ moderatorID: data.id }, process.env.SECRET_SIGNATURE || 'secret');
        res.status(200).json({ token });
     } catch (err) {
        if (err.toString().includes('401'))
            res.status(401).json({
                message: 'Failed to login, check your username and password...',
            });
        else res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
    }
});