import { Router } from 'express';
import { getRepository } from 'typeorm';

import { transformAndValidate } from 'class-transformer-validator';

import { connection } from '../../util/typeorm-connection';
import { Child, Stories, Admin } from '../../database/entity';
import { Only } from '../../middleware';

const finalRoutes = Router();

finalRoutes.get('/', Only(Child), async (req, res) => {
    try {
        const { id, cohort, username, avatar, stories, illustrations } = req.user as Child;

        let randomReviewEndDate = '';
        if (cohort && cohort.dueDates && cohort.dueDates.randomReview) {
            randomReviewEndDate = cohort.dueDates.randomReview.toISOString();
        }

        let votingTimeIsOver = false;
        let Current = new Date();
        if (Current > cohort.dueDates.randomReview) {
            votingTimeIsOver = true;
        }

        let finalScreen = {
            votingTimeIsOver: votingTimeIsOver,
        };

        return res.status(200).json({
            finalScreen,
        });
    } catch (err) {
        console.log('error', err.toString());
        return res.status(500).json({ message: err.toString() });
    }
});

export { finalRoutes };
