import { Router } from 'express';
import { getRepository } from 'typeorm';
import { runScript } from '../../util/scripts/scripting';
import { matchmaking } from './matchmaking_test';
import { matchmaking2 } from './matchmaking2';
import { attemptJSONParse } from '../../util/utils';

import { Only } from '../../middleware';
import { Admin, Matches, Submissions, Child } from '../../database/entity';
import { Matchmaking, WeekMatches } from '../../models';
import { connection } from '../../util/typeorm-connection';

const matchMakingRoutes = Router();

const myAsyncLoopFunction = async (arr, cb) => {
    const promises = arr.map(cb);
    await Promise.all(promises);
    console.log(`All async tasks complete!`);
};

matchMakingRoutes.get('/:week', Only(Admin), async (req, res) => {
    try {
        const submissions = await getRepository(Submissions, connection()).find({
            where: { week: req.params.week, type: 'story' },
        });

        let submissionObject = {};

        for (const submission of submissions) {
            const { grade } = await getRepository(Child, connection()).findOne({
                where: { id: submission.childId },
            });

            submissionObject = {
                ...submissionObject,
                [submission.childId]: {
                    flesch_reading_ease: submission.flesch_reading_ease,
                    smog_index: submission.smog_index,
                    flesch_kincaid: submission.flesch_kincaid_grade,
                    coleman_liau_index: submission.coleman_liau_index,
                    automated_readability_index: submission.automated_readability_index,
                    dale_chall_readability_score: submission.dale_chall_readability_score,
                    difficult_words: submission.difficult_words,
                    linsear_write_formula: submission.linsear_write_formula,
                    gunning_fog: submission.gunning_fog,
                    doc_length: submission.doc_length,
                    quote_count: submission.quote_count,
                    grade: grade,
                },
            };
        }

        const competitions = await match(submissionObject);
        const competition = JSON.parse(competitions[0].split(`'`).join(`"`));

        try {
            for (let [key, value] of Object.entries(competition)) {
                await getRepository(Matches, connection()).save({
                    team1_child1_id: parseInt(value['team_1'][0]),
                    team1_child2_id: parseInt(value['team_1'][1]),
                    team2_child1_id: parseInt(value['team_2'][0]),
                    team2_child2_id: parseInt(value['team_2'][1]),
                    week: parseInt(req.params.week),
                });
            }
            const matches = await getRepository(Matches, connection()).find({
                where: { week: req.params.week },
            });
            res.status(200).json({ message: `saved success`, match: matches });
        } catch (err) {
            console.log(err.toString());
            res.status(500).json({ message: `Saving error, ${err.toString()}` });
        }
    } catch (err) {
        res.status(500).json({ message: `Matchmaking error, ${err.toString()}` });
    }
});

function match(data: Matchmaking) {
    return runScript('./src/util/scripts/matchmaking.py', data, (out: any) =>
        out.map(attemptJSONParse)
    );
}

export { matchMakingRoutes };
