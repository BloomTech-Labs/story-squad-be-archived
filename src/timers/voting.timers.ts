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
                //Find matches from this cohort
                let MatchesInWeek = await MatchesRepo.find({
                    where: [{ week: i.week }],
                });
                // we need verus sets from different matchups.
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

                    // We need to see if the child has any remaining votes. Child.votes < 3
                    for (T1C1.votes; T1C1.votes < 3; T1C1.votes++) {
                        // loop through child.votes until it equals 3
                        //Get a random versus matchup that is NOT from this childs match
                        let ChildMatch = await FindMatchByUID(T1C1.id, i.week);
                        let response = await randomIgnoring(ChildMatch); // response is a versus matchup with lowest votes.
                        let rand = Math.round(Math.random()); // random number, either 0 or 1
                        if (response.story) {
                            let Story = await StoryRepo.findOne({
                                child: response.children[rand],
                                week: i.week,
                            });
                            Story.votes++;
                            await StoryRepo.save(Story);
                        } else {
                            // else it is an illustration
                            let Illustration = await IllustrationRepo.findOne({
                                child: response.children[rand],
                                week: i.week,
                            });
                            Illustration.votes++;
                            await IllustrationRepo.save(Illustration);
                        }

                        response.votes++;
                        await VersusRepo.save(response);
                    } // end for

                    for (T1C2.votes; T1C2.votes < 3; T1C2.votes++) {
                        // loop through child.votes until it equals 3
                        //Get a random versus matchup that is NOT from this childs match
                        let ChildMatch = await FindMatchByUID(T1C2.id, i.week);
                        let response = await randomIgnoring(ChildMatch); // response is a versus matchup with lowest votes.
                        let rand = Math.round(Math.random()); // random number, either 0 or 1

                        if (response.story) {
                            let Story = await StoryRepo.findOne({
                                child: response.children[rand],
                                week: i.week,
                            });
                            Story.votes++;
                            await StoryRepo.save(Story);
                        } else {
                            // else it is an illustration
                            let Illustration = await IllustrationRepo.findOne({
                                child: response.children[rand],
                                week: i.week,
                            });
                            Illustration.votes++;
                            await IllustrationRepo.save(Illustration);
                        }

                        response.votes++;
                        await VersusRepo.save(response);
                    } // end for

                    for (T2C1.votes; T2C1.votes < 3; T2C1.votes++) {
                        // loop through child.votes until it equals 3
                        //Get a random versus matchup that is NOT from this childs match
                        let ChildMatch = await FindMatchByUID(T2C1.id, i.week);
                        let response = await randomIgnoring(ChildMatch); // response is a versus matchup with lowest votes.
                        let rand = Math.round(Math.random()); // random number, either 0 or 1

                        if (response.story) {
                            let Story = await StoryRepo.findOne({
                                child: response.children[rand],
                                week: i.week,
                            });
                            Story.votes++;
                            await StoryRepo.save(Story);
                        } else {
                            // else it is an illustration
                            let Illustration = await IllustrationRepo.findOne({
                                child: response.children[rand],
                                week: i.week,
                            });
                            Illustration.votes++;
                            await IllustrationRepo.save(Illustration);
                        }

                        response.votes++;
                        await VersusRepo.save(response);
                    } // end for

                    for (T2C2.votes; T2C2.votes < 3; T2C2.votes++) {
                        // loop through child.votes until it equals 3
                        //Get a random versus matchup that is NOT from this childs match
                        let ChildMatch = await FindMatchByUID(T2C2.id, i.week);
                        let response = await randomIgnoring(ChildMatch); // response is a versus matchup with lowest votes.
                        let rand = Math.round(Math.random()); // random number, either 0 or 1

                        if (response.story) {
                            let Story = await StoryRepo.findOne({
                                child: response.children[rand],
                                week: i.week,
                            });
                            Story.votes++;
                            await StoryRepo.save(Story);
                        } else {
                            // else it is an illustration
                            let Illustration = await IllustrationRepo.findOne({
                                child: response.children[rand],
                                week: i.week,
                            });
                            Illustration.votes++;
                            await IllustrationRepo.save(Illustration);
                        }

                        response.votes++;
                        await VersusRepo.save(response);
                    } // end for

                    T1C1.progress.randomReview = T1C2.progress.randomReview = T2C1.progress.randomReview = T2C2.progress.randomReview = true;

                    await ChildRepo.save([T1C1, T1C2, T2C1, T2C2]);
                });

                //Set teamReview & save
                i.activity = 'randomReview';

                await CohortRepo.save(i);
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
