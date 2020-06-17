import { Cohort, Child, Matches, Stories, Illustrations } from '../database/entity';
import { getRepository } from 'typeorm';
import { connection } from '../util/typeorm-connection';
import { Versus } from '../database/entity/Versus';
import { FindMatchByUID } from '../util/db-utils';

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

                // correctly calculate wins/losses
                // Handle kids that are not in a match.

                // child.progress
                i.children.forEach(async (kid) => {
                    kid.votes = 0;
                    kid.progress.drawing = false;
                    kid.progress.reading = false;
                    kid.progress.writing = false;
                    kid.progress.teamReview = false;
                    kid.progress.randomReview = false;

                    let ChildMatch = await FindMatchByUID(kid.id, i.week);

                    if (ChildMatch) {
                        let VersusInMatch = await VersusRepo.find({
                            where: { match: ChildMatch.id },
                        });

                        for (let j = 0; j < 4; j++) {
                            let singleVersus = VersusInMatch[j];
                            let versusC1 = singleVersus.children[0].id;
                            let C1Name = await ChildRepo.findOne({
                                where: { id: versusC1 },
                            });
                            let versusC2 = singleVersus.children[1].id;
                            let C2Name = await ChildRepo.findOne({
                                where: { id: versusC2 },
                            });

                            if (singleVersus.story) {
                                let StoryC1 = await StoryRepo.findOne({
                                    where: [{ childId: versusC1 }],
                                });
                                let StoryC2 = await StoryRepo.findOne({
                                    where: [{ childId: versusC2 }],
                                });

                                let winnerId = StoryC1.votes > StoryC2.votes ? versusC1 : versusC2;

                                if (kid.id === winnerId) {
                                    kid.wins++;
                                    kid.total_points =
                                        kid.total_points + StoryC1.points + StoryC2.points;
                                } else if (kid.id === versusC1 || kid.id === versusC2) {
                                    kid.losses++;
                                }
                            } else {
                                // else it is an illustration
                                let PictureC1 = await IllustrationRepo.findOne({
                                    where: [{ childId: versusC1 }],
                                });
                                let PictureC2 = await IllustrationRepo.findOne({
                                    where: [{ childId: versusC2 }],
                                });

                                let winnerId =
                                    PictureC1.votes > PictureC2.votes ? versusC1 : versusC2;

                                if (kid.id === winnerId) {
                                    kid.wins++;
                                    kid.total_points =
                                        kid.total_points + PictureC1.points + PictureC2.points;
                                } else if (kid.id === versusC1 || kid.id === versusC2) {
                                    kid.losses++;
                                }
                            }
                        } // end for
                    }

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
    }, 3000);
}

export { results_timer };
