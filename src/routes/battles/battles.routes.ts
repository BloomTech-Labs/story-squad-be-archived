import { Router } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';

import { Child, Matches, Stories, Illustrations } from '../../database/entity';
import { MatchInfoRepository } from './custom';

import { Only } from '../../middleware/only/only.middleware';
import { connection } from '../../util/typeorm-connection';

const battlesRoutes = Router();

battlesRoutes.get('/battles', Only(Child), async (req, res) => {
    //     try {
    //         const { id, cohort, username, avatar, stories, illustrations } = req.user as Child;
    //         //first get matchid so we know who this child is up against
    //         const match = await returnMatch(id, cohort.week);
    //         let thisMatch = {
    //             matchId: match.id,
    //             week: cohort.week,
    //             team: {
    //                 student: {
    //                     studentId: id,
    //                     username: username,
    //                     avatar: avatar,
    //                     story: {},
    //                     illustration: {},
    //                 },
    //                 teammate: {},
    //             },
    //         };
    //         let teammate = null;
    //         if (!match) {
    //             res.json(401).json({
    //                 message: `Match for Student ID ${id}, for week ${cohort.week} not found`,
    //             });
    //         } else {
    //             {
    //                 match.team1_child1_id === id
    //                     ? (teammate = match.team1_child2_id)
    //                     : match.team1_child2_id === id
    //                     ? (teammate = match.team1_child1_id)
    //                     : match.team2_child1_id === id
    //                     ? (teammate = match.team2_child2_id)
    //                     : (teammate = match.team2_child1_id);
    //             }
    //             console.log(`student: ${thisMatch.team.student.studentId}, teammate: ${teammate}`);
    //             const [story] = stories.filter((el) => el.week === cohort.week);
    //             const [illustration] = illustrations.filter((el) => el.week === cohort.week);
    //             thisMatch.team.student = {
    //                 ...thisMatch.team.student,
    //                 // replacing story and illustration objects as empty strings to avoid sending base64 04/2020
    //                 story: story,
    //                 illustration: illustration,
    //             };
    //             thisMatch.team.teammate = await getCustomRepository(
    //                 MatchInfoRepository,
    //                 connection()
    //             ).findStudentInfo(teammate, cohort.week);
    //             // thisMatch.team.teammate = await getCustomRepository(MatchInfoRepository,)
    //             // previous syntax structure commented out below 3.12.20
    //             // new syntax structure (yet to be tested) 3.18.20
    //         }
    //         return res.status(200).json({
    //             thisMatch,
    //         });
    //     } catch (err) {
    //         console.log(err.toString());
    //         return res.status(500).json({ message: err.toString() });
    //     }
    // });

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
                storyPoints: null,
                illustration: {},
                illustrationPoints: null,
            },
            teammate: {},
        };
        console.log('homeTeam', homeTeam);

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
                    teammate = match.team2_child1_id;
                    opponentA = match.team1_child1_id;
                    opponentB = match.team1_child2_id;
                }
            }

            console.log(`student: ${homeTeam.student.studentId}, teammate: ${teammate}`);
            console.log('teammate', homeTeam.teammate);
            // find CCS and point values
            const [story] = stories.filter((el) => el.week === cohort.week);
            homeTeam.student.story = story;
            const [illustration] = illustrations.filter((el) => el.week === cohort.week);
            homeTeam.student.illustration = illustration;

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
        //////////////////////////////////////////////////
        const myTeam = [
            {
                me: {
                    id,
                    storyPoints: homeTeam.student.story.points,
                    illustrationPoints: homeTeam.student.illustration.points,
                },
            },
            {
                teammate: {
                    id: homeTeam.teammate.studentId,
                    storyPoints: homeTeam.teammate.story.points,
                    illustrationPoints: homeTeam.teammate.illustration.points,
                },
            },
        ];

        const team2 = [
            {
                opponentA: {
                    id: awayTeam.opponentA.studentId,
                    storyPoints: awayTeam.opponentA.story.points,
                    illustrationPoints: awayTeam.opponentA.illustration.points,
                },
            },
            {
                opponentB: {
                    id: awayTeam.opponentB.studentId,
                    storyPoints: awayTeam.opponentB.story.points,
                    illustrationPoints: awayTeam.opponentB.illustration.points,
                },
            },
        ];
        console.log('myTeam', myTeam);
        console.log('team2', team2);
        const higherMyteam = decideHigher(myTeam[0].me, myTeam[1].teammate);
        // array of objects returned by decideHighter  [[storypoint high, storypoint low], [illustrationpoint high, illustrationpoint low]]
        console.log('higherMytem', higherMyteam);

        const higherTeam2 = decideHigher(team2[0].opponentA, team2[1].opponentB);
        console.log('higherTeam2', higherTeam2);

        //storyHigh = [higherMyteam in Story, higherTeam2 in Story, total points]
        const storyHigh = [higherMyteam[0][0], higherTeam2[0][0]];
        storyHigh.push(higherMyteam[0][0].storyPoints + higherTeam2[0][0].storyPoints);
        console.log('storyHigh', storyHigh);

        //storyLow = [LowerMyteam in Story, LowerTeam2 in Story, total points]
        const storyLow = [higherMyteam[0][1], higherTeam2[0][1]];
        storyLow.push(higherMyteam[0][1].storyPoints + higherTeam2[0][1].storyPoints);
        console.log('storyLow', storyLow);

        //illustrationHigh = [higherMyteam in illustration, higherTeam2 in illustration, total points]
        const illustrationHigh = [higherMyteam[1][0], higherTeam2[1][0]];
        illustrationHigh.push(
            higherMyteam[1][0].illustrationPoints + higherTeam2[1][0].illustrationPoints
        );
        console.log('illustrationHigh', illustrationHigh);

        //illustrationLow = [lowerMyteam in illustration, lowerTeam2 in illustration, total points]
        const illustrationLow = [higherMyteam[1][1], higherTeam2[1][1]];
        illustrationLow.push(
            higherMyteam[1][1].illustrationPoints + higherTeam2[1][1].illustrationPoints
        );
        console.log('illustrationLow', illustrationLow);

        const thisBattle = {
            storyHigh,
            storyLow,
            illustrationHigh,
            illustrationLow,
        };

        console.log('thisBattle', thisBattle);

        const thisMatch = {
            team: homeTeam,
            otherTeam: awayTeam,
        };

        return res.status(200).json({ thisMatch, thisBattle });
    } catch (err) {
        console.log(err.toString());
        return res.status(500).json({ message: err.toString() });
    }
});

battlesRoutes.put('/battles', Only(Child), async (req, res) => {
    try {
        const { id, progress } = req.user as Child;
        if (progress.teamReview === true) {
            console.log('progress.teamReview', progress.teamReview);
            return res.status(400).json({
                message: `Cannot submit points twice`,
            });
        }
        const { stories, illustrations } = req.body;

        try {
            await Promise.all(
                stories.map((el) => {
                    getRepository(Stories, connection())
                        .findOne({ id: el.id })
                        .then(async (res) => {
                            await getRepository(Stories, connection()).update(
                                { id: el.id },
                                { points: res.points + el.points }
                            );
                        });
                })
            );
        } catch (err) {
            res.status(400).json({ message: `Story failed` });
        }
        try {
            await Promise.all(
                illustrations.map((el) => {
                    getRepository(Illustrations, connection())
                        .findOne({ id: el.id })
                        .then(async (res) => {
                            await getRepository(Illustrations, connection()).update(
                                { id: el.id },
                                { points: res.points + el.points }
                            );
                        });
                })
            );
        } catch (err) {
            res.status(400).json({ message: 'Illustration failed' });
        }
        await getRepository(Child, connection()).update({ id }, { progress: { teamReview: true } });
        res.status(200).json({ message: 'success' });
    } catch (err) {
        res.status(500).json({ message: err.toString() });
    }
});

export { battlesRoutes };

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
