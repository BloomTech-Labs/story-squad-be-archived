import { Router } from 'express';
import { getRepository } from 'typeorm';

import { connection } from '../../util/typeorm-connection';
import { Child, Admin } from '../../database/entity';
import { Only } from '../../middleware';

const finalRoutes = Router();

finalRoutes.get('/', Only(Child), async (req, res) => {
    try {
        const { cohort } = req.user as Child;

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
