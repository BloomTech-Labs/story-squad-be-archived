import { Cohort, Child, Matches, Stories, Illustrations } from '../database/entity';
import { getRepository } from 'typeorm';
import { connection } from '../util/typeorm-connection';

async function point_allocation_timer() {
    setInterval(async function () {
        let CohortRepo = await getRepository(Cohort, connection());
        let ChildRepo = await getRepository(Child, connection());
        let MatchesRepo = await getRepository(Matches, connection());
        let StoryRepo = await getRepository(Stories, connection());
        let IllustrationRepo = await getRepository(Illustrations, connection());

        //Get current date
        let Current = new Date();

        //Get cohorts & their children
        let Cohorts = await CohortRepo.find({
            where: [{ activity: 'teamReview' }],
            relations: ['children'],
        });

        //For every cohort
        await Cohorts.forEach(async (i) => {
            if (Current > i.dueDates.teamReview) {
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

                    let T1ApplyPoints = 0;
                    let T2ApplyPoints = 0;

                    //teamReview on child's progress is set to true if they've actually voted
                    //Note to future person, do null checks
                    if (!T1C1.progress.teamReview) T1ApplyPoints += 25;
                    if (!T1C2.progress.teamReview) T1ApplyPoints += 25;
                    if (!T2C1.progress.teamReview) T2ApplyPoints += 25;
                    if (!T2C2.progress.teamReview) T2ApplyPoints += 25;

                    await T1C1.stories.forEach(async (story) => {
                        story.points += T1ApplyPoints;
                        await StoryRepo.save(story);
                    });
                    await T1C1.illustrations.forEach(async (illustration) => {
                        illustration.points += T1ApplyPoints;
                        await IllustrationRepo.save(illustration);
                    });
                    await T1C2.stories.forEach(async (story) => {
                        story.points += T1ApplyPoints;
                        await StoryRepo.save(story);
                    });
                    await T1C2.illustrations.forEach(async (illustration) => {
                        illustration.points += T1ApplyPoints;
                        await IllustrationRepo.save(illustration);
                    });

                    await T2C1.stories.forEach(async (story) => {
                        story.points += T2ApplyPoints;
                        await StoryRepo.save(story);
                    });
                    await T2C1.illustrations.forEach(async (illustration) => {
                        illustration.points += T2ApplyPoints;
                        await IllustrationRepo.save(illustration);
                    });
                    await T2C2.stories.forEach(async (story) => {
                        story.points += T2ApplyPoints;
                        await StoryRepo.save(story);
                    });
                    await T2C2.illustrations.forEach(async (illustration) => {
                        illustration.points += T2ApplyPoints;
                        await IllustrationRepo.save(illustration);
                    });

                    T1C1.progress.teamReview = T1C2.progress.teamReview = T2C1.progress.teamReview = T2C2.progress.teamReview = true;

                    await ChildRepo.save([T1C1, T1C2, T2C1, T2C2]);
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
