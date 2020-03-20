import { Router } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';

import { Child, Matches } from '../../database/entity';
import { MatchInfoRepository } from './custom';

import { Only } from '../../middleware/only/only.middleware';
import { connection } from '../../util/typeorm-connection';

const battlesRoutes = Router();

battlesRoutes.get('/battles', Only(Child), async (req, res) => {
    try {
        const { id, cohort, username, avatar, stories, illustrations } = req.user as Child;
        //first get matchid so we know who this child is up against

        const match = await returnMatch(id, cohort.week);

        let thisMatch = {
            matchId: match.id,
            week: cohort.week,
            team: {
                student: {
                    studentId: null,
                    username: username,
                    avatar: avatar,
                    story: {},
                    illustration: {}
                },
                teammate: {}
            },
        };

        if (!match) {
            res.json(401).json({
                message: `Match for Student ID ${id}, for week ${cohort.week} not found`,
            });
        } else {

            const [ story ] = stories.filter(el => el.week === cohort.week)
            const [ illustration ] = illustrations.filter(el => el.week === cohort.week)

            thisMatch.team.student = { ...thisMatch.team.student, story: story, illustration: illustration}
            // thisMatch.team.teammate = await getCustomRepository(MatchInfoRepository,)
            // previous syntax structure commented out below 3.12.20
            // new syntax structure (yet to be tested) 3.18.20


            }

        return res.status(200).json({
            thisMatch,
        });
    } catch (err) {
        console.log(err.toString());
        return res.status(500).json({ message: err.toString() });
    }
});

battlesRoutes.put('/battles', Only(Child), async (req, res) => {
    try {

        const { id } = req.user as Child;
        const { 
            story1id, 
            story1points, 
            story2id, 
            story2points, 
            drawing1id, 
            drawing1points,
            drawing2id,
            drawing2points
             } = req.body

        const resultOne = getCustomRepository(MatchInfoRepository, connection()).updatePoints(
            story1id, story1points, drawing1id, drawing1points
        )
        const resultTwo = getCustomRepository(MatchInfoRepository, connection()).updatePoints(
            story2id, story2points, drawing2id, drawing2points
        )
        
        const results = await Promise.all([ resultOne, resultTwo ])

        res.status(200).json({ message: 'success', info: results });
    } catch (err) {
        res.status(500).json({ message: err.toString() });
    }
});

export { battlesRoutes };

async function returnMatch(id: number, week: number) {
    const match = await getRepository(Matches, connection()).findOne({
        where: [{ team1_child1_id: id, week: week }],
    });
    console.log(match);
    return match ? match : r2(id, week);
}
async function r2(id: number, week: number) {
    const match = await getRepository(Matches, connection()).findOne({
        where: [{ team1_child2_id: id, week: week }],
    });
    console.log(match);
    return match ? match : r3(id, week);
}
async function r3(id: number, week: number) {
    const match = await getRepository(Matches, connection()).findOne({
        where: [{ team2_child1_id: id, week: week }],
    });
    console.log(match);
    return match ? match : r4(id, week);
}
async function r4(id: number, week: number) {
    const match = await getRepository(Matches, connection()).findOne({
        where: [{ team2_child2_id: id, week: week }],
    });
    console.log(match);
    return match ? match : null;
}
