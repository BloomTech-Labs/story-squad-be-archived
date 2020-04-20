function createTeam(team, member) {
    if (getObjectClass(team) === 'awayTeam' && getObjectClass(member) === 'opponentA') {
        return {
            ...team.student,
            ...member,
            role: getObjectClass(member),
        };
    } else if (getObjectClass(team) === 'awayTeam' && getObjectClass(member) === 'opponentB') {
        return {
            ...team.teammate,
            ...member,
            role: getObjectClass(member),
        };
    } else {
        return {
            ...team['member'],
            ...member,
            role: propName(team, member),
        };
    }
}

function getObjectClass(obj) {
    if (typeof obj != 'object' || obj === null) return false;
    else return /(\w+)\(/.exec(obj.constructor.toString())[1];
}

function propName(prop, value) {
    for (var i in prop) {
        if (prop[i] == value) {
            return i;
        }
    }
    return false;
}
export { createTeam };
