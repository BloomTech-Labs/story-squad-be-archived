import { Router } from 'express';
import { getRepository } from 'typeorm';
import { runScript } from '../../util/scripts/scripting';
import { attemptJSONParse } from '../../util/utils';

import { Only } from '../../middleware';
import { Admin, Matches, Stories, Child, Illustrations, Cohort } from '../../database/entity';
import { Matchmaking, WeekMatches } from '../../models';
import { connection } from '../../util/typeorm-connection';

const matchMakingRoutes = Router();
const pointAllocationPeriod = 24; // How long users have to assign their points, in hours

matchMakingRoutes.get('/:week', Only(Admin), async (req, res) => {
    // add delete functionality to this route so deletes matches before repopulating mathes, prevent spamming
    const thisWeek = req.params.week;
    const matches = await getRepository(Matches, connection()).find({
        where: { week: thisWeek },
    });
    console.log(`GET FIRST MATCHES`, matches);
    if (matches.length) {
        return res.status(200).json({ message: `fetch matches success`, match: matches });
    }

    try {
        let stories;
        try {
            stories = await getRepository(Stories, connection()).find({
                where: { week: req.params.week, isFlagged: false },
            });
        } catch (err) {
            console.log(err.toString());
            res.status(500).json({ err: err.toString(), message: 'Could not fetch submissions' });
        }

        let submissionObject = {};

        for (const story of stories) {
            try {
                const [childusMinimus] = await getRepository(Child, connection()).find({
                    where: { id: story.childId },
                });
                // Checks for presence of picture
                const pictureCheck = await getRepository(Illustrations, connection()).find({
                    where: { id: childusMinimus.id, week: req.params.week, isFlagged: false },
                });
                console.log(
                    `PICTURE CHECK - id: ${story.childId}`,
                    `length: ${pictureCheck.length}`
                );

                // if picture is present, perform DS matchmaking
                if (pictureCheck.length) {
                    submissionObject = {
                        ...submissionObject,
                        [story.childId]: {
                            flesch_reading_ease: story.flesch_reading_ease,
                            smog_index: story.smog_index,
                            flesch_kincaid: story.flesch_kincaid_grade,
                            coleman_liau_index: story.coleman_liau_index,
                            automated_readability_index: story.automated_readability_index,
                            dale_chall_readability_score: story.dale_chall_readability_score,
                            difficult_words: story.difficult_words,
                            linsear_write_formula: story.linsear_write_formula,
                            gunning_fog: story.gunning_fog,
                            doc_length: story.doc_length,
                            quote_count: story.quote_count,
                            grade: childusMinimus.grade,
                        },
                    };
                }
            } catch (err) {
                console.log(err.toString());
                res.status(500).json({
                    err: err.toString(),
                    message: 'Could not fetch child within matched submissions',
                });
            }
        }

        let competition;

        if (Object.keys(submissionObject).length > 1) {
            const competitions = await match(submissionObject);
            competition = JSON.parse(competitions[0].split(`'`).join(`"`));
        } else {
            res.json({
                message: `not enough submissions to generate matchmaking within week: ${thisWeek}`,
            });
        }

        try {
            for (let [key, value] of Object.entries(competition)) {
                const existingMatch = await checkTeams(value);
                if (existingMatch[0]) {
                    await persistMatch(value, thisWeek);
                } else {
                    console.log('matches pre-existing');
                }
            }
            const matches = await getRepository(Matches, connection()).find({
                where: { week: thisWeek },
            });

            //Need to go find every cohort that's in this stories week
            {
                let CohortRepo = await getRepository(Cohort, connection());
                let Cohorts = await CohortRepo.find({
                    where: { week: thisWeek },
                });
                let teamReviewDate = new Date();
                teamReviewDate.setHours(teamReviewDate.getHours() + pointAllocationPeriod);
                Cohorts.forEach((i) => {
                    i.activity = 'teamReview';
                    i.dueDates.teamReview = teamReviewDate;
                });
                await CohortRepo.save(Cohorts);
            }

            res.status(200).json({ message: `saved success`, match: matches });
            // await match-ups and responds to FE with match-ups 3.12.20
            // first call to assign match-ups works, but this next await doesn't fully resolve for some reason and generates an empty array
        } catch (err) {
            console.log(err.toString());
            res.status(500).json({ message: `Saving error, ${err.toString()}` });
        }
    } catch (err) {
        res.status(500).json({ message: `Matchmaking error, ${err.toString()}` });
    }
});

matchMakingRoutes.delete('/:week', Only(Admin), async (req, res) => {
    // link this functionality to a button in the admin dashboard, rather than including it in the get reqeust above.
    try {
        const matchesToDelete = await getRepository(Matches, connection()).find({
            select: ['id'],
            where: { week: parseInt(req.params.week) },
        });

        if (matchesToDelete.length) {
            for (let match of matchesToDelete) {
                await getRepository(Matches, connection()).delete({ id: match.id });
            }
            res.status(200).json({
                message: `All matches in week ${req.params.week} have been deleted`,
            });
        } else {
            res.json({ message: `No matches in week ${req.params.week}` });
        }
    } catch (err) {
        res.status(500).json({ err: err.toString() });
    }
});

function match(data: Matchmaking) {
    return runScript('./src/util/scripts/matchmaking.py', data, (out: any) =>
        out.map(attemptJSONParse)
    );
}

export { matchMakingRoutes };

async function checkTeams(value) {
    // checking to see individuals aren't being reused across matchups, can/should be refactored
    let existingMatch = [];
    try {
        existingMatch[0] = await getRepository(Matches, connection()).find({
            where: {
                team1_child1_id:
                    parseInt(value['team_1'][0]) ||
                    parseInt(value['team_1'][1]) ||
                    parseInt(value['team_2'][0]) ||
                    parseInt(value['team_2'][1]),
            },
        });

        existingMatch[1] = await getRepository(Matches, connection()).find({
            where: {
                team1_child2_id:
                    parseInt(value['team_1'][0]) ||
                    parseInt(value['team_1'][1]) ||
                    parseInt(value['team_2'][0]) ||
                    parseInt(value['team_2'][1]),
            },
        });

        existingMatch[2] = await getRepository(Matches, connection()).find({
            where: {
                team2_child1_id:
                    parseInt(value['team_1'][0]) ||
                    parseInt(value['team_1'][1]) ||
                    parseInt(value['team_2'][0]) ||
                    parseInt(value['team_2'][1]),
            },
        });

        existingMatch[3] = await getRepository(Matches, connection()).find({
            where: {
                team2_child2_id:
                    parseInt(value['team_1'][0]) ||
                    parseInt(value['team_1'][1]) ||
                    parseInt(value['team_2'][0]) ||
                    parseInt(value['team_2'][1]),
            },
        });
        console.log(existingMatch);
    } catch (err) {
        console.log(err.toString());
    }
    console.log(`CHECK TEAMS`, existingMatch);
    return existingMatch;
}

async function persistMatch(matchUp, week) {
    await getRepository(Matches, connection()).save({
        team1_child1_id: matchUp['team_1'][0] ? parseInt(matchUp['team_1'][0]) : 0,
        team1_child2_id: matchUp['team_1'][1] ? parseInt(matchUp['team_1'][1]) : 0,
        team2_child1_id: matchUp['team_2'][0] ? parseInt(matchUp['team_2'][0]) : 0,
        team2_child2_id: matchUp['team_2'][1] ? parseInt(matchUp['team_2'][1]) : 0,
        week: parseInt(week),
    });
}
