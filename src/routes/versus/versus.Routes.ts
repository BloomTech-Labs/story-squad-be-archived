import { Router } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';

import { Child, Matches, Stories, Illustrations } from '../../database/entity';
import { MatchInfoRepository } from './custom';

import { Only } from '../../middleware/only/only.middleware';
import { connection } from '../../util/typeorm-connection';

const versusRoutes = Router();

versusRoutes.get('/versus', Only(Child), async (req, res) => {
    try {
        const { id, cohort, username, avatar, stories, illustrations } = req.user as Child;
        //first get matchid so we know who this child is up against

        const match = await returnMatch(id, cohort.week);
        console.log(`MATCH loc18`, match)

        // populate home team object(s)
        let student = null;
        let teammate = null;

        let homeTeam = {
            matchId: match.id,
            week: cohort.week,
            student: {
                studentId: id,
                username: username,
                avatar: avatar,
                story: {},
                storyPoints: null,
                illustration: {},
                illustrationPoints: null,
                },
            teammate: {},
        } 

        // populate away team object(s)
        let opponentA = null;
        let opponentB = null;

        let awayTeam = {
            matchId: match.id,
            week: cohort.week,
            opponentA: {},
            opponentB: {}
        }
        

        

        if (!match) {
            res.json(401).json({
                message: `Match for Student ID ${id}, for week ${cohort.week} not found`,
            });
        } else {
            {
                if (match.team1_child1_id === id) {
                    teammate = match.team1_child2_id
                    opponentA = match.team2_child1_id
                    opponentB = match.team2_child2_id
                } else if (match.team1_child2_id === id) {
                        teammate = match.team1_child1_id
                        opponentA = match.team2_child1_id
                        opponentB = match.team2_child2_id
                    } else if (match.team2_child1_id === id) {
                            teammate = match.team2_child2_id
                            opponentA = match.team1_child1_id
                            opponentB = match.team1_child2_id
                        } else {
                            teammate = match.team2_child1_id
                            opponentA = match.team1_child1_id
                            opponentB = match.team1_child2_id
                        }
                    }
                
            
            console.log(`student: ${homeTeam.student.studentId}, teammate: ${teammate}`);
            // find CCS and point values
            const [story] = stories.filter((el) => el.week === cohort.week);
            const [illustration] = illustrations.filter((el) => el.week === cohort.week);

            homeTeam.student = {
                ...homeTeam.student,
                // replacing story and illustration objects as empty strings to avoid sending base64 04/2020
                story: "STORY PLACEHOLDER",
                storyPoints: story.points,
                illustration: "ILLUSTRATION PLACEHOLDER",
                illustrationPoints: illustration.points,
            };

            homeTeam.teammate = await getCustomRepository(
                MatchInfoRepository,
                connection()
            ).findStudentInfo(teammate, cohort.week);
            // thisMatch.team.teammate = await getCustomRepository(MatchInfoRepository,)
            // previous syntax structure commented out below 3.12.20
            // new syntax structure (yet to be tested) 3.18.20

            awayTeam.opponentA = await getCustomRepository(
                MatchInfoRepository,
                connection()
            ).findStudentInfo(opponentA, cohort.week);

            awayTeam.opponentB = await getCustomRepository(
                MatchInfoRepository,
                connection()
            ).findStudentInfo(opponentB, cohort.week);
        }
        
        return res.status(200).json([
            homeTeam, awayTeam
        ]);
    } catch (err) {
        console.log(err.toString());
        return res.status(500).json({ message: err.toString() });
    }

});

export { versusRoutes };

async function returnMatch(id: number, week: number) {
    const match = await getRepository(Matches, connection()).findOne({
        where: [{ team1_child1_id: id, week: week }],
    });

    return match ? match : r2(id, week);
}
async function r2(id: number, week: number) {
    const match = await getRepository(Matches, connection()).findOne({
        where: [{ team1_child2_id: id, week: week }],
    });
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
