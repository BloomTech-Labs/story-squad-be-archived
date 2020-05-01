import { Cohort } from '../database/entity';
import { getRepository } from 'typeorm';
import { connection } from '../util/typeorm-connection';

async function point_allocation_timer() {
    setInterval(async function () {
        let CohortRepo = await getRepository(Cohort, connection());

        //Get current date
        let Current = new Date();

        //For every cohort
        let Cohorts = await CohortRepo.find();

        await Cohorts.forEach(async (i) => {
            if (i.activity === 'teamReview')
                if (Current > i.dueDates.teamReview) {
                    //Do checks on everybody

                    //Set teamReview & save
                    i.activity = 'randomReview';
                    await CohortRepo.save(i);
                }
        });
    }, 300000);
}

export { point_allocation_timer };
