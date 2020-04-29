import { getRepository } from 'typeorm';
import { connection } from './typeorm-connection';
import { Matches } from '../database/entity';

export async function FindMatchByUID(UID: number, week: number): Promise<Matches | null> {
    return await getRepository(Matches, connection()).findOne({
        where: [
            { team1_child1_id: UID, week: week },
            { team1_child2_id: UID, week: week },
            { team2_child1_id: UID, week: week },
            { team2_child2_id: UID, week: week },
        ],
    });
}

export async function FindMatchByID(matchId: number, week: number) {
    return await getRepository(Matches, connection()).findOne({
        where: { id: matchId, week: week },
    });
}

export async function getMaxByColumn(entity: Function, columnName: string) {
    return (
        await getRepository(entity, connection())
            .createQueryBuilder(entity.name)
            .select(`MAX(${entity.name}.${columnName})`, 'max')
            .getRawOne()
    ).max;
}
