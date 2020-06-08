import { Router } from 'express';
import { getRepository } from 'typeorm';

import { connection } from '../../util/typeorm-connection';
import { Child, Matches, Stories, Illustrations, Cohort } from '../../database/entity';
import { Only } from '../../middleware';

import { FindMatchByUID } from '../../util/db-utils';

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
        let IllustrationRepo = getRepository(Illustrations, connection());
        let MatchesRepo = getRepository(Matches, connection());
        let CohortRepo = getRepository(Cohort, connection());

        let ChildMatch = await FindMatchByUID(id, cohort.week);

        if (!ChildMatch) {
            //Error?
            res.status(300).json({ msg: 'No match could be determined' });
            return;
        }

        let Build = {} as any;

        let StoryT1C1 = await StoryRepo.findOne({
            where: [{ id: ChildMatch.team1_child1_id, week: cohort.week }],
        });
        let StoryT1C2 = await StoryRepo.findOne({
            where: [{ id: ChildMatch.team1_child2_id, week: cohort.week }],
        });
        let StoryT2C1 = await StoryRepo.findOne({
            where: [{ id: ChildMatch.team2_child1_id, week: cohort.week }],
        });
        let StoryT2C2 = await StoryRepo.findOne({
            where: [{ id: ChildMatch.team2_child2_id, week: cohort.week }],
        });

        let PictureT1C1 = await IllustrationRepo.findOne({
            where: [{ id: ChildMatch.team1_child1_id, week: cohort.week }],
        });
        let PictureT1C2 = await IllustrationRepo.findOne({
            where: [{ id: ChildMatch.team1_child2_id, week: cohort.week }],
        });
        let PictureT2C1 = await IllustrationRepo.findOne({
            where: [{ id: ChildMatch.team2_child1_id, week: cohort.week }],
        });
        let PictureT2C2 = await IllustrationRepo.findOne({
            where: [{ id: ChildMatch.team2_child2_id, week: cohort.week }],
        });

        Build.StoryT1C1votes = StoryT1C1.votes;
        Build.StoryT1C2votes = StoryT1C2.votes;
        Build.StoryT2C1votes = StoryT2C1.votes;
        Build.StoryT2C2votes = StoryT2C2.votes;

        Build.StoryT1C1points = StoryT1C1.points;
        Build.StoryT1C2points = StoryT1C2.points;
        Build.StoryT2C1points = StoryT2C1.points;
        Build.StoryT2C2points = StoryT2C2.points;

        Build.PictureT1C1votes = PictureT1C1.votes;
        Build.PictureT1C2votes = PictureT1C2.votes;
        Build.PictureT2C1votes = PictureT2C1.votes;
        Build.PictureT2C2votes = PictureT2C2.votes;

        Build.PictureT1C1points = PictureT1C1.points;
        Build.PictureT1C2points = PictureT1C2.points;
        Build.PictureT2C1points = PictureT2C1.points;
        Build.PictureT2C2points = PictureT2C2.points;

        return res.status(200).json({
            ChildMatch,
            Build,
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
