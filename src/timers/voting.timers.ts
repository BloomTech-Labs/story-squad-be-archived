import { Cohort, Child, Matches, Stories, Illustrations } from '../database/entity';
import { getRepository } from 'typeorm';
import { connection } from '../util/typeorm-connection';
import { sortByPoints } from '../routes/versus/versusRoutes.functions';
import { Versus } from '../database/entity/Versus';
import { randomIgnoring } from '../routes/voting/votingRoutes.functions';

async function vote_allocation_timer() {
    setInterval(async function () {
        let CohortRepo = getRepository(Cohort, connection());
        let ChildRepo = getRepository(Child, connection());
        let MatchesRepo = getRepository(Matches, connection());
        let StoryRepo = getRepository(Stories, connection());
        let IllustrationRepo = getRepository(Illustrations, connection());

        let Current = new Date();

        let cohortEnd = await CohortRepo.find({
            where: [{ activity: 'randomReview' }],
            relations: ['children'],
        });

        await cohortEnd.forEach(async (i) => {
            if (Current > i.dueDates.randomReview) {
                // We need matches from a DIFFERENT cohort, not the same cohort.
                //Find matches from this cohort
                let MatchesInWeek = await MatchesRepo.find({
                    where: [{ week: i.week }],
                });
                let CohortMatches = FindMatchesByChildren(MatchesInWeek, i.children) as Matches[];

                //Check if children in each match have voted

                //For every match
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

                    let T1ApplyVotes = 0;
                    let T2ApplyVotes = 0;

                    //teamReview on child's progress is set to true if they've actually voted
                    if (!T1C1.progress.randomReview) T1ApplyVotes += 25;
                    if (!T1C2.progress.randomReview) T1ApplyVotes += 25;
                    if (!T2C1.progress.randomReview) T2ApplyVotes += 25;
                    if (!T2C2.progress.randomReview) T2ApplyVotes += 25;

                    //T1C1.progress.randomReview = T1C2.progress.randomReview = T2C1.progress.randomReview = T2C2.progress.randomReview = true;

                    await ChildRepo.save([T1C1, T1C2, T2C1, T2C2]);
                });
            }
        });
    }, 60000);
}

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

export { vote_allocation_timer };
