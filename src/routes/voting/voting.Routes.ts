import { Router } from 'express';
import { Only } from '../../middleware';
import { Child, Matches } from '../../database/entity';
import { getManager, Not } from 'typeorm';
import { connection } from '../../util/typeorm-connection';
import { Versus } from '../../database/entity/Versus';
import { FindMatchByUID } from '../../util/db-utils';

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

        let Response = await manager
            .createQueryBuilder(Versus, 'versus')
            .where({ match: Not(ignore.id), votes: LowestNeeded })
            .orderBy('RANDOM()')
            .limit(1)
            .getOne();

        return Response;
    } catch (error) {
        console.log(error);
    }
}

votingRoutes.get('/voting', Only(Child), async (req, res) => {
    let User = req.user as Child;
    let ChildMatch = await FindMatchByUID(User.id, User.cohort.week);
    let response = await randomIgnoring(ChildMatch);

    res.status(200).json(response);
});

export { votingRoutes };
