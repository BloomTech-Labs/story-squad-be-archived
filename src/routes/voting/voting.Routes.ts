import { Router } from 'express';
import { Only } from '../../middleware';
import { Child, Stories, Illustrations } from '../../database/entity';
import { getRepository } from 'typeorm';
import { connection } from '../../util/typeorm-connection';
import { Versus } from '../../database/entity/Versus';
import { FindMatchByUID } from '../../util/db-utils';
import { TypeCast } from '../../util/utils';
import { storyReturn, illustrationReturn } from './votingRoutes.imports';
import { randomIgnoring } from './votingRoutes.functions';

const votingRoutes = Router();

votingRoutes.get('/voting', Only(Child), async (req, res) => {
    let User = req.user as Child;
    let ChildMatch = await FindMatchByUID(User.id, User.cohort.week);

    //Get a random versus matchup that is NOT from this childs match
    let response = await randomIgnoring(ChildMatch);

    if (!response) {
        //Error?
        res.status(300).json({ msg: 'No match could be determined' });
        return;
    }

    let Build = {} as any;

    Build.matchupID = response.id;

    if (response.story) {
        //If story, grab them and relay them back
        let StoryRepo = getRepository(Stories, connection());
        Build.child1 = TypeCast(
            storyReturn,
            await StoryRepo.findOne({ where: { child: response.children[0] } })
        );
        Build.child2 = TypeCast(
            storyReturn,
            await StoryRepo.findOne({ where: { child: response.children[1] } })
        );
    } else {
        //If illustration, grab them and relay them back
        let IllustrationRepo = getRepository(Illustrations, connection());
        Build.child1 = TypeCast(
            illustrationReturn,
            await IllustrationRepo.findOne({ where: { child: response.children[0] } })
        );
        Build.child2 = TypeCast(
            illustrationReturn,
            await IllustrationRepo.findOne({ where: { child: response.children[1] } })
        );
    }

    res.status(200).json(Build);
});

votingRoutes.post('/voting', Only(Child), async (req, res) => {
    let ChildRepo = getRepository(Child, connection());
    let VersusRepo = getRepository(Versus, connection());

    let User = req.user as Child;

    if (User.votes > 2) {
        res.status(200).json({ msg: "Vote didn't count, but it worked!" });
        return;
    }

    let childID = req.body.childID as number;
    let matchupID = req.body.matchupID as number;

    if (!childID || !matchupID) {
        res.status(300).json({ msg: 'Invalid match paramaters' });
        return;
    }

    //Verify the given child is in the given matchup
    let VersusMatchup = await VersusRepo.findOne(matchupID);

    if (
        !VersusMatchup ||
        (VersusMatchup.children[0].id !== childID && VersusMatchup.children[1].id !== childID)
    ) {
        res.status(300).json({ msg: 'Given match data is invalid..' });
        return;
    }

    let targetChild =
        VersusMatchup.children[0].id === childID
            ? VersusMatchup.children[0]
            : VersusMatchup.children[1];

    //Update the voters votes
    User.votes++;
    await ChildRepo.save(User);

    //Update the versus matches votes
    VersusMatchup.votes++;
    await VersusRepo.save(VersusMatchup);

    if (VersusMatchup.story) {
        //We need to add 1 vote to the childs tied story
        let StoryRepo = getRepository(Stories, connection());
        let Story = await StoryRepo.findOne({ child: targetChild });
        Story.votes++;
        StoryRepo.save(Story);
    } else {
        //We need to add 1 vote to the childs tied illustration
        let IllustrationRepo = getRepository(Illustrations, connection());
        let Illustration = await IllustrationRepo.findOne({ child: targetChild });
        Illustration.votes++;
        IllustrationRepo.save(Illustration);
    }

    res.status(200).json({ msg: 'Good.' });
});

export { votingRoutes };
