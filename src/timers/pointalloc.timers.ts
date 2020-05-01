import { getMaxByColumn } from '../util/db-utils';
import { Cohort } from '../database/entity';
import { getRepository } from 'typeorm';
import { connection } from '../util/typeorm-connection';

async function point_allocation_timer() {
    setInterval(async function () {
        let CohortRepo = await getRepository(Cohort, connection());

        //Get latest cohort class
        let latestCohort = (await CohortRepo.findOne(
            (await getMaxByColumn(Cohort, 'id')) as number
        )) as Cohort;

        //Get current date
        let Current = new Date();

        if (Current > latestCohort.dueDates.teamReview) {
            //Do checks on everybody
        }
    }, 300000);
}

export { point_allocation_timer };
