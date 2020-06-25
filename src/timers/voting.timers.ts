import { Cohort, Child, Matches, Stories, Illustrations } from '../database/entity';
import { getRepository } from 'typeorm';
import { connection } from '../util/typeorm-connection';
import { Versus } from '../database/entity/Versus';

async function vote_allocation_timer() {
    setInterval(async function () {
        let CohortRepo = getRepository(Cohort, connection());
        let ChildRepo = getRepository(Child, connection());
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

                // Loop through each versus, check for uncast votes, and cast them randomly.
                await VersusInCohort.forEach(async (vs) => {
                    for (let j = 0; j < 3; j++) {
                        // Each versus has 3 votes, to avoid ties.
                        if (vs.votes < 3) {
                            let rand = Math.round(Math.random()); // random number, either 0 or 1
                            if (vs.story) {
                                // if it is a story
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

                //Set randomReview, child.votes & save
                i.children.forEach(async (kid) => {
                    kid.votes = 3;
                    kid.progress.randomReview = true;
                    await ChildRepo.save(kid);
                });

                i.activity = 'results';

                let resultsDate = Current;
                resultsDate.setHours(resultsDate.getHours() + 24);
                i.dueDates.results = resultsDate;

                await CohortRepo.save(i);
            }
        });
    }, 420000);
}

export { vote_allocation_timer };
