import { Child } from '../../database/entity';

export function decideHigher(studentA, studentB) {
    const high = [];
    if (studentA.storyPoints > studentB.storyPoints) high.push([studentA, studentB]);
    else high.push([studentB, studentA]);

    if (studentA.illustrationPoints > studentB.illustrationPoints) high.push([studentA, studentB]);
    else high.push([studentB, studentA]);

    return high;
}

export function sortByPoints(team: Child[], key: string, week: number) {
    const [user1, user2] = team;
    const [submission1] = user1[`${key}`].filter((element) => element.week === week);
    const [submission2] = user2[`${key}`].filter((element) => element.week === week);
    return submission1.points > submission2.points
        ? [submission1, submission2]
        : [submission2, submission1];
}
