import { Router } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';

import { Child, Matches, Stories, Illustrations } from '../../database/entity';
import { MatchInfoRepository } from './custom';
import { storyParse, illustrationParse } from './child.imageParse';
import { Only } from '../../middleware/only/only.middleware';
import { connection } from '../../util/typeorm-connection';

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
                storyPoints: null,
                illustration: {},
                illustrationPoints: null,
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
                story: story.story && storyParse('homeTeam_student', story.story),
                storyPoints: story.points,
                illustration:
                    illustration.illustration &&
                    illustrationParse('homeTeam_student', illustration.illustration),

                illustrationPoints: illustration.points,
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
                story: story.story && storyParse('homeTeam_teammate', story.story),
                illustration:
                    illustration.illustration &&
                    illustrationParse('homeTeam_teammate', illustration.illustration),
            };

            awayTeam.opponentA = await getCustomRepository(
                MatchInfoRepository,
                connection()
            ).findStudentInfo(opponentA, cohort.week);

            awayTeam.opponentA = {
                ...awayTeam.opponentA,
                story: story.story && storyParse('awayTeam_opponentA', story.story),
                illustration:
                    illustration.illustration &&
                    illustrationParse('awayTeam_opponentA', illustration.illustration),
            };

            awayTeam.opponentB = await getCustomRepository(
                MatchInfoRepository,
                connection()
            ).findStudentInfo(opponentB, cohort.week);
            // console.log('opponentB', awayTeam.opponentB.story);

            awayTeam.opponentB = {
                ...awayTeam.opponentB,
                story: story.story && storyParse('awayTeam_opponentB', story.story),
                illustration:
                    illustration.illustration &&
                    illustrationParse('awayTeam_opponentB', illustration.illustration),
            };
        }

        // Round allocation functions below

        const higherMyteam = decideHigher(homeTeam.student, homeTeam.teammate);
        // array of objects returned by decideHighter  [[storypoint high, storypoint low], [illustrationpoint high, illustrationpoint low]]

        const higherTeam2 = decideHigher(awayTeam.opponentA, awayTeam.opponentB);

        //storyHigh = [higherMyteam in Story, higherTeam2 in Story, total points]
        const storyHigh = [higherMyteam[0][0], higherTeam2[0][0]];
        storyHigh.push(higherMyteam[0][0].storyPoints + higherTeam2[0][0].storyPoints);

        //storyLow = [LowerMyteam in Story, LowerTeam2 in Story, total points]
        const storyLow = [higherMyteam[0][1], higherTeam2[0][1]];
        storyLow.push(higherMyteam[0][1].storyPoints + higherTeam2[0][1].storyPoints);

        //illustrationHigh = [higherMyteam in illustration, higherTeam2 in illustration, total points]
        const illustrationHigh = [higherMyteam[1][0], higherTeam2[1][0]];
        illustrationHigh.push(
            higherMyteam[1][0].illustrationPoints + higherTeam2[1][0].illustrationPoints
        );

        //illustrationLow = [lowerMyteam in illustration, lowerTeam2 in illustration, total points]
        const illustrationLow = [higherMyteam[1][1], higherTeam2[1][1]];
        illustrationLow.push(
            higherMyteam[1][1].illustrationPoints + higherTeam2[1][1].illustrationPoints
        );

        const thisBattle = {
            storyHigh: [
                {
                    id: storyHigh[0].studentId,
                    username: storyHigh[0].username,
                    avatar: storyHigh[0].avatar,
                    story: storyHigh[0].story,
                    // && storyParse('story_high1', storyHigh[0].story),
                    storyPoints: storyHigh[0].storyPoints,
                },
                {
                    id: storyHigh[1].studentId,
                    username: storyHigh[1].username,
                    avatar: storyHigh[1].avatar,
                    story: storyHigh[1].story,
                    storyPoints: storyHigh[1].storyPoints,
                },
                {
                    total: storyHigh[2],
                },
            ],
            storyLow: [
                {
                    id: storyLow[0].studentId,
                    username: storyLow[0].username,
                    avatar: storyLow[0].avatar,
                    story: storyLow[0].story,
                    storyPoints: storyLow[0].storyPoints,
                },
                {
                    id: storyLow[1].studentId,
                    username: storyLow[1].username,
                    avatar: storyLow[1].avatar,
                    story: storyLow[1].story,
                    storyPoints: storyLow[1].storyPoints,
                },
                {
                    total: storyLow[2],
                },
            ],
            illustrationHigh: [
                {
                    id: illustrationHigh[0].studentId,
                    username: illustrationHigh[0].username,
                    avatar: illustrationHigh[0].avatar,
                    illustration: illustrationHigh[0].illustration,
                    illustrationPoints: illustrationHigh[0].illustrationPoints,
                },
                {
                    id: illustrationHigh[1].studentId,
                    username: illustrationHigh[1].username,
                    avatar: illustrationHigh[1].avatar,
                    illustration: illustrationHigh[1].illustration,
                    illustrationPoints: illustrationHigh[1].illustrationPoints,
                },
                {
                    total: illustrationHigh[2],
                },
            ],
            illustrationLow: [
                {
                    id: illustrationLow[0].studentId,
                    username: illustrationLow[0].username,
                    avatar: illustrationLow[0].avatar,
                    illustration: illustrationLow[0].illustration,
                    illustrationPoints: illustrationLow[0].illustrationPoints,
                },
                {
                    id: illustrationLow[1].studentId,
                    username: illustrationLow[1].username,
                    avatar: illustrationLow[1].avatar,
                    illustration: illustrationLow[1].illustration,
                    illustrationPoints: illustrationLow[1].illustrationPoints,
                },
                {
                    total: illustrationLow[2],
                },
            ],
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
