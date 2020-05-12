import { getManager, Not } from 'typeorm';
import { connection } from '../../util/typeorm-connection';
import { Versus } from '../../database/entity/Versus';
import { Matches } from '../../database/entity';

export async function randomIgnoring(ignore: Matches) {
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
