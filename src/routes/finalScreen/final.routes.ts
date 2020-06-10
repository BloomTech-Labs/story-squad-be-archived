import { Router } from 'express';
import { getRepository } from 'typeorm';

import { connection } from '../../util/typeorm-connection';
import { Child, Stories, Illustrations } from '../../database/entity';
import { Versus } from '../../database/entity/Versus';
import { Only } from '../../middleware';

import { FindMatchByUID } from '../../util/db-utils';

const finalRoutes = Router();

finalRoutes.get('/time', Only(Child), async (req, res) => {
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

finalRoutes.get('/results', Only(Child), async (req, res) => {
    try {
        const { cohort, id } = req.user as Child;
        let ChildRepo = getRepository(Child, connection());
        let VersusRepo = getRepository(Versus, connection());
        let StoryRepo = getRepository(Stories, connection());
        let IllustrationRepo = getRepository(Illustrations, connection());

        let ChildMatch = await FindMatchByUID(id, cohort.week);

        if (!ChildMatch) {
            //Error?
            res.status(300).json({ msg: 'No match could be determined' });
            return;
        }

        let VersusInMatch = await VersusRepo.find({
            where: { match: ChildMatch.id },
        });

        let V1 = {} as any;
        V1.versus = 1;
        let V2 = {} as any;
        V2.versus = 2;
        let V3 = {} as any;
        V3.versus = 3;
        let V4 = {} as any;
        V4.versus = 4;

        let Build = [V1, V2, V3, V4] as any;

        // get stories and pics for one versus. Repeat x4

        for (let j = 0; j < 4; j++) {
            let singleVersus = VersusInMatch[j];
            let versusC1 = singleVersus.children[0].id;
            let C1Name = await ChildRepo.findOne({
                where: { id: versusC1 },
            });
            Build[j].C1Name = C1Name.username;
            let versusC2 = singleVersus.children[1].id;
            let C2Name = await ChildRepo.findOne({
                where: { id: versusC2 },
            });
            Build[j].C2Name = C2Name.username;

            if (singleVersus.story) {
                let StoryC1 = await StoryRepo.findOne({
                    where: [{ childId: versusC1 }],
                });
                let StoryC2 = await StoryRepo.findOne({
                    where: [{ childId: versusC2 }],
                });
                Build[j].C1Id = versusC1;
                Build[j].C2Id = versusC2;
                Build[j].StoryC1votes = StoryC1.votes;
                Build[j].StoryC2votes = StoryC2.votes;
                Build[j].totalPoints = StoryC1.points + StoryC2.points;
                Build[j].winnerId = StoryC1.votes > StoryC2.votes ? versusC1 : versusC2;
                Build[j].winnerName =
                    StoryC1.votes > StoryC2.votes ? C1Name.username : C2Name.username;
                Build[j].StoryC1points = StoryC1.points;
                Build[j].StoryC2points = StoryC2.points;
            } else {
                // else its an illustration
                let PictureC1 = await IllustrationRepo.findOne({
                    where: [{ childId: versusC1 }],
                });
                let PictureC2 = await IllustrationRepo.findOne({
                    where: [{ childId: versusC2 }],
                });
                Build[j].C1Id = versusC1;
                Build[j].C2Id = versusC2;
                Build[j].PictureC1votes = PictureC1.votes;
                Build[j].PictureC2votes = PictureC2.votes;
                Build[j].totalPoints = PictureC1.points + PictureC2.points;
                Build[j].winnerId = PictureC1.votes > PictureC2.votes ? versusC1 : versusC2;
                Build[j].winnerName =
                    PictureC1.votes > PictureC2.votes ? C1Name.username : C2Name.username;
                Build[j].PictureC1points = PictureC1.points;
                Build[j].PictureC2points = PictureC2.points;
            }
        } // end for

        return res.status(200).json({
            Build,
            //VersusInMatch,
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
