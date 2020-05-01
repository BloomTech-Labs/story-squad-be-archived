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

        //Get matches
        let TotalMatches = await MatchesRepo.find();

        //Get cohorts & their children
        let Cohorts = await CohortRepo.find({ relations: ['children'] });

        //For every cohort
        await Cohorts.forEach(async (i) => {
            if (i.activity === 'teamReview')
                if (Current > i.dueDates.teamReview) {
                    //Find matches from this cohort
                    let CohortMatches = FindMatchesByChildren(TotalMatches, i.children);

                    //Check if children in each match have voted

                    //For every match
                    CohortMatches.forEach((match) => {
                        //Check children
                    });

                    //Set teamReview & save
                    i.activity = 'randomReview';
                    await CohortRepo.save(i);
                }
        });
    }, 300000);
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

export { point_allocation_timer };
