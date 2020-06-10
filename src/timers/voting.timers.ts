import { Cohort, Child, Matches, Stories, Illustrations } from '../database/entity';
import { getRepository } from 'typeorm';
import { connection } from '../util/typeorm-connection';
import { sortByPoints } from '../routes/versus/versusRoutes.functions';
import { Versus } from '../database/entity/Versus';
import { randomIgnoring } from '../routes/voting/votingRoutes.functions';
import { FindMatchByUID } from '../util/db-utils';

async function vote_allocation_timer() {
    setInterval(async function () {
        let CohortRepo = getRepository(Cohort, connection());
        let ChildRepo = getRepository(Child, connection());
        let MatchesRepo = getRepository(Matches, connection());
        let StoryRepo = getRepository(Stories, connection());
        let IllustrationRepo = getRepository(Illustrations, connection());
        let VersusRepo = getRepository(Versus, connection());

        let Current = new Date();

        let Cohorts = await CohortRepo.find({
            where: [{ activity: 'randomReview' }],
            relations: ['children'],
        });

        await Cohorts.forEach(async (i) => {
            if (Current > i.dueDates.randomReview) {
                let VersusInCohort = await VersusRepo.find({
                    where: { cohortId: i.id },
                });

                await VersusInCohort.forEach(async (vs) => {
                    for (let j = 0; j < 3; j++) {
                        if (vs.votes < 3) {
                            let rand = Math.round(Math.random()); // random number, either 0 or 1
                            if (vs.story) {
                                let Story = await StoryRepo.findOne({
                                    child: vs.children[rand],
                                    week: i.week,
                                });
                                Story.votes++;
                                await StoryRepo.save(Story);
                            } else {
                                // else it is an illustration
                                let Illustration = await IllustrationRepo.findOne({
                                    child: vs.children[rand],
                                    week: i.week,
                                });
                                Illustration.votes++;
                                await IllustrationRepo.save(Illustration);
                            }
                            vs.votes++;
                            await VersusRepo.save(vs);
                        }
                    } // end for
                });

                //Set teamReview & save
                i.children.forEach(async (kid) => {
                    kid.votes = 3;
                    kid.progress.randomReview = true;
                    await ChildRepo.save(kid);
                });

                i.activity = 'randomReview';

                await CohortRepo.save(i);
            }
        });
    }, 30000);
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
