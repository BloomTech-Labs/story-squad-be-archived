import { Router } from 'express';
import { getRepository } from 'typeorm';

import { connection } from '../../util/typeorm-connection';
import { Child, Matches, Stories, Illustrations, Cohort } from '../../database/entity';
import { Only } from '../../middleware';

const finalRoutes = Router();

finalRoutes.get('/', Only(Child), async (req, res) => {
    try {
        const { cohort } = req.user as Child;

        let randomReviewEndDate = '';
        if (cohort && cohort.dueDates && cohort.dueDates.randomReview) {
            randomReviewEndDate = cohort.dueDates.randomReview.toISOString();
        }

        let votingTimeIsOver = false;
        let Current = new Date();
        if (Current > cohort.dueDates.randomReview) {
            votingTimeIsOver = true;
        }

        let finalScreen = {
            votingTimeIsOver: votingTimeIsOver,
        };

        return res.status(200).json({
            finalScreen,
        });
    } catch (err) {
        console.log('error', err.toString());
        return res.status(500).json({ message: err.toString() });
    }
});

finalRoutes.get('/results/', Only(Child), async (req, res) => {
    try {
        const { cohort, id } = req.user as Child;
        let ChildRepo = getRepository(Child, connection());
        let StoryRepo = getRepository(Stories, connection());
        let MatchesRepo = getRepository(Matches, connection());
        let CohortRepo = getRepository(Cohort, connection());

        let Cohorts = await CohortRepo.find({
            where: [{ id: cohort.id }],
            relations: ['children'],
        });
        let MatchesInWeek = await MatchesRepo.find({
            where: [{ week: cohort.week }],
        });
        //let ChildrenInCohort = await ChildRepo.find({ where: { cohort: cohort.id } });
        let CohortMatches = FindMatchesByChildren(MatchesInWeek, Cohorts[0].children) as Matches[];

        let Build = {} as any;
        let test = 'initial';
        await CohortMatches.forEach(async (match) => {
            //Check children
            let T1C1 = (await ChildRepo.findOne({
                where: [{ id: match.team1_child1_id }],
                relations: ['illustrations', 'stories'],
            })) as Child;
            let T1C2 = (await ChildRepo.findOne({
                where: [{ id: match.team1_child2_id }],
                relations: ['illustrations', 'stories'],
            })) as Child;
            let T2C1 = (await ChildRepo.findOne({
                where: [{ id: match.team2_child1_id }],
                relations: ['illustrations', 'stories'],
            })) as Child;
            let T2C2 = (await ChildRepo.findOne({
                where: [{ id: match.team2_child2_id }],
                relations: ['illustrations', 'stories'],
            })) as Child;
            Build.child1votes = T1C1.stories[0].votes;
            test = 'different';

            console.log('T1C2', T1C2.stories[0].points);
        });

        console.log('test . . .', test);
        return res.status(200).json({
            CohortMatches,
        });
    } catch (err) {
        console.log('error', err.toString());
        return res.status(500).json({ message: err.toString() });
    }
});

function FindMatchesByChildren(allMatches, children) {
    //This can be removed IF the matches get
    //team1: child[], team2: child[]
    //instead of literal number id's
    let Matches = [];
    allMatches.forEach((match) => {
        for (let x = 0; x < children.length; x++) {
            switch (children[x].id) {
                case match.team1_child1_id:
                    Matches.push(match);
                    x = children.length;
                    break;
                case match.team1_child2_id:
                    Matches.push(match);
                    x = children.length;
                    break;
                case match.team2_child1_id:
                    Matches.push(match);
                    x = children.length;
                    break;
                case match.team2_child2_id:
                    Matches.push(match);
                    x = children.length;
                    break;
                default:
                    break;
            }
        }
    });
    return Matches;
}

export { finalRoutes };
