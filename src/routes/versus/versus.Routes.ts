import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { Team } from './team.class';
import { Child } from '../../database/entity';
import { MatchInfoRepository } from './custom';
import { Only } from '../../middleware/only/only.middleware';
import { connection } from '../../util/typeorm-connection';
import e = require('express');
import { decideHigher, returnMatch } from './versusRoutes.functions';
import { assignRole } from './assignRole';
import { matchVersusPlayers } from './matchVersusPlayers';
import { createTeam } from './createTeam';
import { createStudent } from './createStudent';

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

            // creation for homeTeam student
            homeTeam.student = createStudent(homeTeam, story, illustration);

            const teammate = await getCustomRepository(
                MatchInfoRepository,
                connection()
            ).findStudentInfo(teammate_id, cohort.week);

            // creation for homeTeam teammate
            homeTeam.teammate = createTeam(teammate, 'teammate');

            const opponentA = await getCustomRepository(
                MatchInfoRepository,
                connection()
            ).findStudentInfo(opponentA_id, cohort.week);

            // creation for awayTeam student
            awayTeam.student = createTeam(opponentA, 'opponentA');

            const opponentB = await getCustomRepository(
                MatchInfoRepository,
                connection()
            ).findStudentInfo(opponentB_id, cohort.week);

            // creation for awayTeam teammate
            awayTeam.teammate = createTeam(opponentB, 'opponentB');
        }
        // createTeam(awayTeam, opponentB);
        // who is higher in story and illustration points between student and teammate in homeTeam?
        // array of array returned by decideHighter  [[storypoint high, storypoint low], [illustrationpoint high, illustrationpoint low]]
        const higherMyteam = decideHigher(homeTeam.student, homeTeam.teammate);
        // assign storyRole and illustrationRole to student and teammate in homeTeam
        assignRole(higherMyteam, homeTeam);
        // who is higher in story and illustration points between opponentA and opponentB in awayTeam?
        const higherTeam2 = decideHigher(awayTeam.student, awayTeam.teammate);
        // assign storyRole and illustrationRole to opponentA and opponentB in awayTeam
        assignRole(higherTeam2, awayTeam);

        // matching players for student and teammate with players in opponent team
        matchVersusPlayers(homeTeam, awayTeam);
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
