import { Cohort, Child, Matches, Stories, Illustrations } from '../database/entity';
import { getRepository } from 'typeorm';
import { connection } from '../util/typeorm-connection';
import { Versus } from '../database/entity/Versus';

async function results_timer() {
    setInterval(async function () {
        let CohortRepo = getRepository(Cohort, connection());
        let ChildRepo = getRepository(Child, connection());
        let StoryRepo = getRepository(Stories, connection());
        let IllustrationRepo = getRepository(Illustrations, connection());
        let VersusRepo = getRepository(Versus, connection());

        let Current = new Date();

        let Cohorts = await CohortRepo.find({
            where: [{ activity: 'results' }],
            relations: ['children'],
        });

        await Cohorts.forEach(async (i) => {
            if (Current > i.dueDates.results) {
                // reset all the data here.

                // What data do we reset for the next week?

                // child.progress
                i.children.forEach(async (kid) => {
                    kid.votes = 0;
                    kid.progress.drawing = false;
                    kid.progress.reading = false;
                    kid.progress.writing = false;
                    kid.progress.teamReview = false;
                    kid.progress.randomReview = false;

                    // child career stats - TODO ************************

                    await ChildRepo.save(kid);
                });

                // cohort.activity
                i.activity = 'reading';

                // cohort.dueDates
                i.dueDates.drawing = Current;
                i.dueDates.reading = Current;
                i.dueDates.writing = Current;
                i.dueDates.teamReview = null;
                i.dueDates.randomReview = null;
                i.dueDates.results = null;

                // ???

                // *********************************************
                // What tables get truncated? Matches and versus, but actually we want to keep the previous week for
                // the trophy room?
                // We might need to add a week column on versus tables.

                // cohort.week
                i.week++;

                await CohortRepo.save(i);
            }
        });
    }, 90000);
}

export { results_timer };
