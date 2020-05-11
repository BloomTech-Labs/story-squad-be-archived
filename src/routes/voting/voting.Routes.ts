import { Router } from 'express';
import { Only } from '../../middleware';
import { Child, Matches, Stories, Illustrations } from '../../database/entity';
import { getManager, Not, getRepository, Connection } from 'typeorm';
import { connection } from '../../util/typeorm-connection';
import { Versus } from '../../database/entity/Versus';
import { FindMatchByUID } from '../../util/db-utils';
import { TypeCast } from '../../util/utils';
import { storyReturn, illustrationReturn } from './votingRoutes.imports';

const votingRoutes = Router();

async function randomIgnoring(ignore: Matches) {
    const manager = getManager(connection());
    const VersusRepo = manager.getRepository(Versus);

    try {
        let iter = 0;
        let LowestNeeded = 5;

        while (LowestNeeded === 5) {
            let temp = await VersusRepo.findOne({
                where: { votes: iter, match: Not(ignore.id) },
            });

            if (temp) LowestNeeded = iter;

            iter++;
        }

        let RandMatch = await manager
            .createQueryBuilder(Versus, 'versus')
            .where({ match: Not(ignore.id), votes: LowestNeeded })
            .orderBy('RANDOM()')
            .limit(1)
            .getOne();

        return await manager.getRepository(Versus).findOne({ where: { id: RandMatch.id } });
    } catch (error) {
        console.log(error);
    }
}

votingRoutes.get('/voting', Only(Child), async (req, res) => {
    let User = req.user as Child;
    let ChildMatch = await FindMatchByUID(User.id, User.cohort.week);

    //Get a random versus matchup that is NOT from this childs match
    let response = await randomIgnoring(ChildMatch);

    if (!response) {
        //Error?
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
    let User = req.user as Child;

    if (User.votes > 2) {
        res.status(200).json({ msg: "Vote didn't count, but it worked!" });
        return;
    }

    let childID = req.body.childID as number;
    let matchupID = req.body.matchupID as number;

    if (!childID || !matchupID) {
        res.status(300).json({ msg: 'Invalid match paramaters' });
    }

    //Verify the given child is in the given matchup
    let VersusMatchup = await getRepository(Versus, connection()).findOne(matchupID);

    if (
        !VersusMatchup ||
        (VersusMatchup.children[0].id !== childID && VersusMatchup.children[1].id !== childID)
    ) {
        res.status(300).json({ msg: 'Given match data is invalid..' });
        return;
    }

    let Child =
        VersusMatchup.children[0].id === childID
            ? VersusMatchup.children[0]
            : VersusMatchup.children[1];

    console.log(Child);
});

export { votingRoutes };
