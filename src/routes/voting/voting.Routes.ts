import { Router } from 'express';
import { Only } from '../../middleware';
import { Child } from '../../database/entity';
import { getManager, Not } from 'typeorm';
import { connection } from '../../util/typeorm-connection';
import { Versus } from '../../database/entity/Versus';

const votingRoutes = Router();

async function randomIgnoring(ignore: number) {
    const manager = getManager(connection());

    try {
        let Response = await manager
            .createQueryBuilder(Versus, 'versus')
            .where({ id: Not(ignore) })
            .orderBy('RANDOM()')
            .limit(1)
            .getOne();

        return Response;
    } catch (error) {
        console.log(error);
    }
}

votingRoutes.get('/voting', Only(Child), async (req, res) => {
    let response = await randomIgnoring(5);

    res.status(200).json(response);
});

export { votingRoutes };
