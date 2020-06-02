import { Child } from '../../database/entity';

export function sortByPoints(team: Child[], key: string, week: number) {
    const [user1, user2] = team;
    const [submission1] = user1[`${key}`].filter((element) => element.week === week);
    const [submission2] = user2[`${key}`].filter((element) => element.week === week);
    return submission1.points > submission2.points
        ? [submission1, submission2]
        : [submission2, submission1];
}

//Used to arrange match objects to have the home team always be match["0"] [LEFT]
export function MatchSortByTeam(match, home_team) {
    let newRange = {} as any;
    newRange.points = match.points;

    if (match[0].childId === home_team[0].id || match[0].childId === home_team[1].id) {
        newRange = match;
    } else {
        newRange[0] = match[1];
        newRange[1] = match[0];
    }

    return newRange;
}
