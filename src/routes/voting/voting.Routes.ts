import { Router } from 'express';
import { Only } from '../../middleware';
import { Child, Matches, Stories, Illustrations } from '../../database/entity';
import { getManager, Not, getRepository } from 'typeorm';
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
        let LowestNeeded = 15000;

        while (LowestNeeded === 15000) {
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

export { votingRoutes };
