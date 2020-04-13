// Testing Versus Routes before comitting to a seperate folder

import { Router } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';

import { Child, Matches, Stories, Illustrations } from '../../database/entity';
import { MatchInfoRepository } from './custom';

import { Only } from '../../middleware/only/only.middleware';
import { connection } from '../../util/typeorm-connection';

const battlesRoutes = Router();

battlesRoutes.get('/versus', Only(Child), async (req, res) => {
    try {
        const { id, cohort, username, avatar, stories, illustrations } = req.user as Child;
        // first get matchid so we know who this child is up against

        const match = await returnMatch(id, cohort.week);
        // matchobject provides ids for ALL users/teams
        // homeTeam awayTeam
        // 2 stories 2 pictures per team
        // 1 points score per submission (8 in total)
        // connect rounds and allocate points correctly to determinefinal scores per round?
        let player1 = match.team1_child1_id;
        let player2 = match.team1_child2_id;
        let player3 = match.team1_child2_id;
        let player4 = match.team1_child2_id;

        let players = [player1, player2, player3, player4];
        // newPlayer accepts pushed student
        let newPlayers = [];

        const player = {
            studentId: 'a',
            teamID: 'a',
            username: 'a',
            avatar: 'a',
            story: {
                thumbnail: '',
                file: '',
                points: '50',
            },
            illustration: {
                thumbnail: '',
                file: '',
                points: '50',
            },
        };

        // const populatedMatch = {
        // function that would map through each player in a match and perform api calls to BE
        // arrange rounds - who vs who
        // a function is needed in order to sum the team mates totalPoints
        //     roundS1: {
        //         player1: {
        //             studentId: 'a',
        //             teamID: 'a',
        //             username: 'a',
        //             avatar: 'a',
        //             story: {
        //                 thumbnail: '',
        //                 file: '',
        //                 points: '50',
        //             },
        //         },
        //         player2: {
        //             studentId: 'a',
        //             teamID: 'a',
        //             username: 'a',
        //             avatar: 'a',
        //             story: {
        //                 thumbnail: '',
        //                 file: '',
        //                 points: '50',
        //             },
        //         },
        //         totalPoints: null,
        //     },
        //     roundS2: {},
        //     roundI1: {},
        //     roundI2: {},
        // };

        // let thisMatch = {
        //     matchId: match.id,
        //     week: cohort.week,
        //     homeTeam: {
        //         student: {
        //             studentId: id,
        //             username: username,
        //             avatar: avatar,
        //             story: {
        //                 file: '',
        //                 points: '',
        //             },
        //             illustration: '',
        //         },
        //         teammate: {},
        //     },
        //     awayTeam: {
        //         student: {
        //             studentId: '',
        //             username: '',
        //             avatar: '',
        //             story: '',
        //             illustration: '',
        //         },
        //         opponent: {},
        //     },
        // };

        let teammate = null;
        if (!match) {
            res.json(401).json({
                message: `Match for Student ID ${id}, for week ${cohort.week} not found`,
            });
        } else {
            {
                match.team1_child1_id === id
                    ? (teammate = match.team1_child2_id)
                    : match.team1_child2_id === id
                    ? (teammate = match.team1_child1_id)
                    : match.team2_child1_id === id
                    ? (teammate = match.team2_child2_id)
                    : (teammate = match.team2_child1_id);
            }
            console.log(`student: ${thisMatch.homeTeam.student.studentId}, teammate: ${teammate}`);
            const [story] = stories.filter((el) => el.week === cohort.week);
            const [illustration] = illustrations.filter((el) => el.week === cohort.week);

            thisMatch.homeTeam.student = {
                ...thisMatch.homeTeam.student,
                story: story,
                illustration: illustration,
            };
            thisMatch.team.teammate = await getCustomRepository(
                MatchInfoRepository,
                connection()
            ).findStudentInfo(teammate, cohort.week);
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
        const { id, progress } = req.user as Child;

        if (progress.teamReview === true) {
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
