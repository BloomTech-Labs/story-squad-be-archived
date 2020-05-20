import { getManager, Not } from 'typeorm';
import { connection } from '../../util/typeorm-connection';
import { Versus } from '../../database/entity/Versus';
import { Matches } from '../../database/entity';
import { emojiSelection } from './votingRoutes.imports';

export async function randomIgnoring(ignore: Matches) {
    const manager = getManager(connection());
    const VersusRepo = manager.getRepository(Versus);

    try {
        let iter = 0;
        let LowestNeeded = 6;

        while (LowestNeeded === 6) {
            let temp = await VersusRepo.findOne({
                where: { votes: iter, match: Not(ignore.id) },
            });

            if (temp) LowestNeeded = iter;

            iter++;

            if (iter === 6) break;
        }

        let RandMatch = await manager
            .createQueryBuilder(Versus, 'versus')
            .where({ match: Not(ignore.id), votes: LowestNeeded })
            .orderBy('RANDOM()')
            .limit(1)
            .getOne();

        if (!RandMatch) return undefined;

        return await manager.getRepository(Versus).findOne({ where: { id: RandMatch.id } });
    } catch (error) {
        console.log(error);
    }
}

export function validEmojiArray(array: string[]) {
    if (array.length < 4 || array.length > 6) return false;

    for (let i = 0; i < array.length; i++) if (!emojiSelection.includes(array[i])) return false;

    return true;
}
