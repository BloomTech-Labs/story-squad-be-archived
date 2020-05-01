import { Cohort, Child, Matches } from '../database/entity';
import { getRepository } from 'typeorm';
import { connection } from '../util/typeorm-connection';

async function point_allocation_timer() {
    setInterval(async function () {
        let CohortRepo = await getRepository(Cohort, connection());
        let ChildRepo = await getRepository(Child, connection());
        let MatchesRepo = await getRepository(Matches, connection());

        //Get current date
        let Current = new Date();

        //For every cohort
        let Cohorts = await CohortRepo.find({ relations: ['children'] });

        await Cohorts.forEach(async (i) => {
            if (i.activity === 'teamReview')
                if (Current > i.dueDates.teamReview) {
                    //Find matches from this cohort

                    //Set teamReview & save
                    i.activity = 'randomReview';
                    await CohortRepo.save(i);
                }
        });
    }, 300000);
}

export { point_allocation_timer };
