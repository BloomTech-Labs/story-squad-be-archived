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

export function MatchSortByTeam(match, home_team) {
    let newRange = {} as any;
    newRange.points = match.points;

    if (match[0].id === home_team[0].id || match[0].id === home_team[1].id) {
        newRange = match;
    } else {
        newRange[0] = match[1];
        newRange[1] = match[0];
    }

    return newRange;
}
