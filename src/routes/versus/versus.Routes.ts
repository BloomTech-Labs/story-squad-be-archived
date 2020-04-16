import { Router } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';

import { Child, Matches, Stories, Illustrations } from '../../database/entity';
import { MatchInfoRepository } from './custom';
import { storyParse, illustrationParse } from './child.imageParse';
import { Only } from '../../middleware/only/only.middleware';
import { connection } from '../../util/typeorm-connection';
import e = require('express');

const versusRoutes = Router();

versusRoutes.get('/versus', Only(Child), async (req, res) => {
    try {
        const { id, cohort, username, avatar, stories, illustrations } = req.user as Child;
        //first get matchid so we know who this child is up against

        const match = await returnMatch(id, cohort.week);
        console.log(`MATCH loc18`, match);

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
                // storyUrl: '',
                storyPoints: null,
                illustration: {},
                // illustrationUrl: '',
                illustrationPoints: null,
                role: null,
                storyRole: null,
                illustrationRole: null,
                storyOpponent: null,
                illustrationOpponent: null,
                storyTotal: null,
                illustrationTotal: null,
            },
            teammate: {},
        };

        // populate away team object(s)
        let opponentA = null;
        let opponentB = null;

        let awayTeam = {
            matchId: match.id,
            week: cohort.week,
            opponentA: {},
            opponentB: {},
        };

        if (!match) {
            res.json(401).json({
                message: `Match for Student ID ${id}, for week ${cohort.week} not found`,
            });
        } else {
            {
                if (match.team1_child1_id === id) {
                    teammate = match.team1_child2_id;
                    opponentA = match.team2_child1_id;
                    opponentB = match.team2_child2_id;
                } else if (match.team1_child2_id === id) {
                    teammate = match.team1_child1_id;
                    opponentA = match.team2_child1_id;
                    opponentB = match.team2_child2_id;
                } else if (match.team2_child1_id === id) {
                    teammate = match.team2_child2_id;
                    opponentA = match.team1_child1_id;
                    opponentB = match.team1_child2_id;
                } else {
                    student = match.team2_child2_id;
                    teammate = match.team2_child1_id;
                    opponentA = match.team1_child1_id;
                    opponentB = match.team1_child2_id;
                }
            }

            console.log(`student: ${homeTeam.student.studentId}, teammate: ${teammate}`);
            // find CCS and point values
            const [story] = stories.filter((el) => el.week === cohort.week);
            const [illustration] = illustrations.filter((el) => el.week === cohort.week);

            homeTeam.student = {
                ...homeTeam.student,
                // replacing story (loc77) and illustration loc(78) objects as empty strings to avoid sending base64 04/2020
                story: story.story,
                storyPoints: story.points,
                // storyUrl: storyParse('homeTeam_student', story.story),
                illustration: illustration.illustration,
                // illustrationUrl: illustrationParse('homeTeam_student', illustration.illustration),
                // illustration.illustration &&
                // illustrationParse('homeTeam_student', illustration.illustration),

                illustrationPoints: illustration.points,
                role: 'student',
                storyRole: '',
                illustrationRole: '',
                storyOpponent: null,
                illustrationOpponent: null,
                storyTotal: null,
                illustrationTotal: null,
            };

            homeTeam.teammate = await getCustomRepository(
                MatchInfoRepository,
                connection()
            ).findStudentInfo(teammate, cohort.week);
            // thisMatch.team.teammate = await getCustomRepository(MatchInfoRepository,)
            // previous syntax structure commented out below 3.12.20
            // new syntax structure (yet to be tested) 3.18.20

            homeTeam.teammate = {
                ...homeTeam.teammate,
                story: story.story,
                // storyUrl: storyParse('homeTeam_teammate', story.story),
                illustration: illustration.illustration,

                // illustration.illustration &&
                // illustrationParse('homeTeam_teammate', illustration.illustration),
                role: 'teammate',
                storyRole: null,
                illustrationRole: null,
                storyOpponent: null,
                illustrationOpponent: null,
                storyTotal: null,
                illustrationTotal: null,
            };

            awayTeam.opponentA = await getCustomRepository(
                MatchInfoRepository,
                connection()
            ).findStudentInfo(opponentA, cohort.week);

            awayTeam.opponentA = {
                ...awayTeam.opponentA,
                story: story.story,
                illustration: illustration.illustration,
                role: 'opponentA',
                storyRole: null,
                illustrationRole: null,
            };

            awayTeam.opponentB = await getCustomRepository(
                MatchInfoRepository,
                connection()
            ).findStudentInfo(opponentB, cohort.week);
            // console.log('opponentB', awayTeam.opponentB.story);

            awayTeam.opponentB = {
                ...awayTeam.opponentB,
                story: story.story,
                illustration: illustration.illustration,
                role: 'opponentB',
                storyRole: null,
                illustrationRole: null,
            };
        }

        // Round allocation functions below

        const higherMyteam = decideHigher(homeTeam.student, homeTeam.teammate);
        // array of objects returned by decideHighter  [[storypoint high, storypoint low], [illustrationpoint high, illustrationpoint low]]
        if (higherMyteam[0][0].role === 'student' && higherMyteam[1][0].role === 'student') {
            homeTeam.student.storyRole = 'storyHigh';
            homeTeam.teammate.storyRole = 'storyLow';
            homeTeam.student.illustrationRole = 'illustrationHigh';
            homeTeam.teammate.illustrationRole = 'illustrationLow';
        } else {
            homeTeam.student.storyRole = 'storyLow';
            homeTeam.teammate.storyRole = 'storyHigh';
            homeTeam.student.illustrationRole = 'illustrationLow';
            homeTeam.teammate.illustrationRole = 'illustrationHigh';
        }
        console.log('higherMyTeam', higherMyteam);
        console.log('homeTeam.student.storyRole', homeTeam.student.illustrationRole);

        console.log('highmyteam00', higherMyteam[0][0].role);
        const higherTeam2 = decideHigher(awayTeam.opponentA, awayTeam.opponentB);

        if (higherTeam2[0][0].role === 'opponentA' && higherTeam2[1][0].role === 'opponentA') {
            awayTeam.opponentA.storyRole = 'storyHigh';
            awayTeam.opponentB.storyRole = 'storyLow';
            awayTeam.opponentA.illustrationRole = 'illustrationHigh';
            awayTeam.opponentB.illustrationRole = 'illustrationLow';
        } else {
            awayTeam.opponentA.storyRole = 'storyLow';
            awayTeam.opponentB.storyRole = 'storyHigh';
            awayTeam.opponentA.illustrationRole = 'illustrationLow';
            awayTeam.opponentB.illustrationRole = 'illustrationHigh';
        }

        if (homeTeam.student.storyRole === awayTeam.opponentA.storyRole) {
            homeTeam.student.storyOpponent = awayTeam.opponentA;
            homeTeam.teammate.storyOpponent = awayTeam.opponentB;
            homeTeam.student.storyTotal =
                homeTeam.student.storyPoints + awayTeam.opponentA.storyPoints;
            homeTeam.teammate.storyTotal =
                homeTeam.teammate.storyPoints + awayTeam.opponentB.storyPoints;
        } else {
            homeTeam.student.storyOpponent = awayTeam.opponentB;
            homeTeam.teammate.storyOpponent = awayTeam.opponentA;
            homeTeam.student.storyTotal =
                homeTeam.student.storyPoints + awayTeam.opponentB.storyPoints;
            homeTeam.teammate.storyTotal =
                homeTeam.teammate.storyPoints + awayTeam.opponentA.storyPoints;
        }
        if (homeTeam.student.illustrationRole === awayTeam.opponentA.illustrationRole) {
            homeTeam.student.illustrationOpponent = awayTeam.opponentA;
            homeTeam.teammate.illustrationOpponent = awayTeam.opponentB;
            homeTeam.student.illustrationTotal =
                homeTeam.student.illustrationPoints + awayTeam.opponentA.illustrationPoints;
            homeTeam.teammate.illustrationTotal =
                homeTeam.teammate.illustrationPoints + awayTeam.opponentB.illustrationPoints;
        } else {
            homeTeam.student.illustrationOpponent = awayTeam.opponentB;
            homeTeam.teammate.illustrationOpponent = awayTeam.opponentA;
            homeTeam.student.illustrationTotal =
                homeTeam.student.illustrationPoints + awayTeam.opponentB.illustrationPoints;
            homeTeam.teammate.illustrationTotal =
                homeTeam.teammate.illustrationPoints + awayTeam.opponentA.illustrationPoints;
        }

        const thisBattle = {
            battleInfo: {
                student: {
                    ...homeTeam.student,
                },
                teammate: {
                    ...homeTeam.teammate,
                },
            },
        };

        console.log('thisBattle', thisBattle);

        return res.status(200).json(thisBattle);
    } catch (err) {
        console.log(err.toString());
        return res.status(500).json({ message: err.toString() });
    }
});

export { versusRoutes };

function decideHigher(studentA, studentB) {
    const high = [];
    if (studentA.storyPoints > studentB.storyPoints) high.push([studentA, studentB]);
    else high.push([studentB, studentA]);

    if (studentA.illustrationPoints > studentB.illustrationPoints) high.push([studentA, studentB]);
    else high.push([studentB, studentA]);

    return high;
}

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
