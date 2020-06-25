import { Cohort, Child, Matches, Stories, Illustrations } from '../database/entity';
import { getRepository } from 'typeorm';
import { connection } from '../util/typeorm-connection';
import { sortByPoints } from '../routes/versus/versusRoutes.functions';
import { Versus } from '../database/entity/Versus';

async function point_allocation_timer() {
    setInterval(async function () {
        let CohortRepo = getRepository(Cohort, connection());
        let ChildRepo = getRepository(Child, connection());
        let MatchesRepo = getRepository(Matches, connection());
        let StoryRepo = getRepository(Stories, connection());
        let IllustrationRepo = getRepository(Illustrations, connection());

        const votePeriod = 24; // How long users have to vote, in hours

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

                    await GenerateVersusFromMatch(match, [T1C1, T1C2, T2C1, T2C2], i);
                });

                //Set teamReview & save
                i.activity = 'randomReview';

                let randomReviewDate = Current;
                randomReviewDate.setHours(randomReviewDate.getHours() + votePeriod);
                i.dueDates.randomReview = randomReviewDate;

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

async function GenerateVersusFromMatch(match: Matches, children: Child[], cohort: Cohort) {
    let team1 = [children[0], children[1]];
    let team2 = [children[2], children[3]];

    const team1Stories = sortByPoints(team1, 'stories', match.week);
    const team2Stories = sortByPoints(team2, 'stories', match.week);

    const team1Illustrations = sortByPoints(team1, 'illustrations', match.week);
    const team2Illustrations = sortByPoints(team2, 'illustrations', match.week);

    //Calculate the HighStory matchup
    let HighStoryMatchup = [team1Stories[0], team2Stories[0]];
    await BuildAndSaveVersus(
        HighStoryMatchup[0].childId,
        HighStoryMatchup[1].childId,
        cohort,
        false,
        match
    );

    //Calculate the LowStory matchup
    let LowStoryMatchup = [team1Stories[1], team2Stories[1]];
    await BuildAndSaveVersus(
        LowStoryMatchup[0].childId,
        LowStoryMatchup[1].childId,
        cohort,
        false,
        match
    );

    //Calculate the HighIllustration matchup
    let HighIllustrationMatchup = [team1Illustrations[0], team2Illustrations[0]];
    await BuildAndSaveVersus(
        HighIllustrationMatchup[0].childId,
        HighIllustrationMatchup[1].childId,
        cohort,
        true,
        match
    );

    //Calculate the LowIllustration matchup
    let LowIllustrationMatchup = [team1Illustrations[1], team2Illustrations[1]];
    await BuildAndSaveVersus(
        LowIllustrationMatchup[0].childId,
        LowIllustrationMatchup[1].childId,
        cohort,
        true,
        match
    );
}

async function BuildAndSaveVersus(
    cid1: number,
    cid2: number,
    cohort: Cohort,
    story: boolean,
    match: Matches
) {
    let VersusRepo = getRepository(Versus, connection());
    let ChildRepo = getRepository(Child, connection());

    let child1 = await ChildRepo.findOne(cid1);
    let child2 = await ChildRepo.findOne(cid2);
    let Temp = new Versus(cohort, [child1, child2], 0, story, match);
    VersusRepo.save(Temp);
}

export { point_allocation_timer };
