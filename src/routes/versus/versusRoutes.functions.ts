import { Matches } from '../../database/entity';
import { getRepository } from 'typeorm';
import { connection } from '../../util/typeorm-connection';
function decideHigher(studentA, studentB) {
    const high = [];
    if (studentA.storyPoints > studentB.storyPoints) high.push([studentA, studentB]);
    else high.push([studentB, studentA]);

    if (studentA.illustrationPoints > studentB.illustrationPoints) high.push([studentA, studentB]);
    else high.push([studentB, studentA]);

    return high;
}

async function returnMatch(id: number, week: number) {
    const match = await getRepository(Matches, connection()).findOne({
        where: [{ team1_child1_id: id, week: week }],
    });

    return match ? match : r2(id, week);
}
export { decideHigher, returnMatch };
