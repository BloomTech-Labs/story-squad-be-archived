import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { Team } from './team.class';
import { Child } from '../../database/entity';
import { MatchInfoRepository } from './custom';
import { Only } from '../../middleware/only/only.middleware';
import { connection } from '../../util/typeorm-connection';
import e = require('express');
import { decideHigher, returnMatch } from './versusRoutes.functions';
const versusRoutes = Router();

versusRoutes.get('/versus', Only(Child), async (req, res) => {
    try {
        const { id, cohort, username, avatar, stories, illustrations } = req.user as Child;
        //first get matchid so we know who this child is up against

        const match = await returnMatch(id, cohort.week);
        // populate home team object(s)

        // homeTeam created
        const homeTeam = new Team(match.id, cohort.week);
        homeTeam.student.studentId = id;
        homeTeam.student.username = username;
        homeTeam.student.avatar = avatar;

        let student_id = null;
        let teammate_id = null;

        //awayTeam created
        const awayTeam = new Team(match.id, cohort.week);
        let opponentA_id = null;
        let opponentB_id = null;

        if (!match) {
            res.json(401).json({
                message: `Match for Student ID ${id}, for week ${cohort.week} not found`,
            });
        } else {
            {
                if (match.team1_child1_id === id) {
                    teammate_id = match.team1_child2_id;
                    opponentA_id = match.team2_child1_id;
                    opponentB_id = match.team2_child2_id;
                } else if (match.team1_child2_id === id) {
                    teammate_id = match.team1_child1_id;
                    opponentA_id = match.team2_child1_id;
                    opponentB_id = match.team2_child2_id;
                } else if (match.team2_child1_id === id) {
                    teammate_id = match.team2_child2_id;
                    opponentA_id = match.team1_child1_id;
                    opponentB_id = match.team1_child2_id;
                } else {
                    student_id = match.team2_child2_id;
                    teammate_id = match.team2_child1_id;
                    opponentA_id = match.team1_child1_id;
                    opponentB_id = match.team1_child2_id;
                }
            }

            const [story] = stories.filter((el) => el.week === cohort.week);
            const [illustration] = illustrations.filter((el) => el.week === cohort.week);
            homeTeam.student.story = story.story;
            homeTeam.student.storyPoints = story.points;
            homeTeam.student.illustration = illustration.illustration;
            homeTeam.student.illustrationPoints = illustration.points;
            homeTeam.student.role = 'student';

            const teammate = await getCustomRepository(
                MatchInfoRepository,
                connection()
            ).findStudentInfo(teammate_id, cohort.week);

            homeTeam.teammate = {
                ...homeTeam.teammate,
                ...teammate,
                role: 'teammate',
            };

            const opponentA = await getCustomRepository(
                MatchInfoRepository,
                connection()
            ).findStudentInfo(opponentA_id, cohort.week);

            awayTeam.student = {
                ...awayTeam.student,
                ...opponentA,
                role: 'opponentA',
            };

            const opponentB = await getCustomRepository(
                MatchInfoRepository,
                connection()
            ).findStudentInfo(opponentB_id, cohort.week);
            // console.log('opponentB', awayTeam.opponentB.story);

            awayTeam.teammate = {
                ...awayTeam.teammate,
                ...opponentB,
                role: 'opponentB',
            };
        }

        // Round allocation functions below

        const higherMyteam = decideHigher(homeTeam.student, homeTeam.teammate);
        // array of arrays returned by decideHighter  [[storypoint high, storypoint low], [illustrationpoint high, illustrationpoint low]]
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

        const higherTeam2 = decideHigher(awayTeam.student, awayTeam.teammate);

        if (higherTeam2[0][0].role === 'opponentA' && higherTeam2[1][0].role === 'opponentA') {
            awayTeam.student.storyRole = 'storyHigh';
            awayTeam.teammate.storyRole = 'storyLow';
            awayTeam.student.illustrationRole = 'illustrationHigh';
            awayTeam.teammate.illustrationRole = 'illustrationLow';
        } else {
            awayTeam.student.storyRole = 'storyLow';
            awayTeam.teammate.storyRole = 'storyHigh';
            awayTeam.student.illustrationRole = 'illustrationLow';
            awayTeam.teammate.illustrationRole = 'illustrationHigh';
        }

        if (homeTeam.student.storyRole === awayTeam.student.storyRole) {
            homeTeam.student.storyOpponent = awayTeam.student;
            homeTeam.teammate.storyOpponent = awayTeam.teammate;
            homeTeam.student.storyTotal =
                homeTeam.student.storyPoints + awayTeam.student.storyPoints;
            homeTeam.teammate.storyTotal =
                homeTeam.teammate.storyPoints + awayTeam.teammate.storyPoints;
        } else {
            homeTeam.student.storyOpponent = awayTeam.teammate;
            homeTeam.teammate.storyOpponent = awayTeam.student;
            homeTeam.student.storyTotal =
                homeTeam.student.storyPoints + awayTeam.teammate.storyPoints;
            homeTeam.teammate.storyTotal =
                homeTeam.teammate.storyPoints + awayTeam.student.storyPoints;
        }

        if (homeTeam.student.illustrationRole === awayTeam.student.illustrationRole) {
            homeTeam.student.illustrationOpponent = awayTeam.student;
            homeTeam.teammate.illustrationOpponent = awayTeam.teammate;
            homeTeam.student.illustrationTotal =
                homeTeam.student.illustrationPoints + awayTeam.student.illustrationPoints;
            homeTeam.teammate.illustrationTotal =
                homeTeam.teammate.illustrationPoints + awayTeam.teammate.illustrationPoints;
        } else {
            homeTeam.student.illustrationOpponent = awayTeam.teammate;
            homeTeam.teammate.illustrationOpponent = awayTeam.student;
            homeTeam.student.illustrationTotal =
                homeTeam.student.illustrationPoints + awayTeam.teammate.illustrationPoints;
            homeTeam.teammate.illustrationTotal =
                homeTeam.teammate.illustrationPoints + awayTeam.student.illustrationPoints;
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

        return res.status(200).json(thisBattle);
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
});

export { versusRoutes };
