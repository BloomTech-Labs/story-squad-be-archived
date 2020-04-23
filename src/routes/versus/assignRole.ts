function assignRole(higherTeam, team) {
    if (
        (higherTeam[0][0].role === 'student' && higherTeam[1][0].role === 'student') ||
        (higherTeam[0][0].role === 'opponentA' && higherTeam[1][0].role === 'opponentA')
    ) {
        setStudentHigh(team, 'story');
        setStudentHigh(team, 'illustration');
    } else if (
        (higherTeam[0][0].role === 'student' && higherTeam[1][0].role === 'teammate') ||
        (higherTeam[0][0].role === 'opponentA' && higherTeam[1][0].role === 'opponentB')
    ) {
        setStudentHigh(team, 'story');
        setTeammateHigh(team, 'illustration');
    } else if (
        (higherTeam[0][0].role === 'teammate' && higherTeam[1][0].role === 'student') ||
        (higherTeam[0][0].role === 'opponentB' && higherTeam[1][0].role === 'opponentA')
    ) {
        setTeammateHigh(team, 'story');
        setStudentHigh(team, 'illustration');
    } else {
        setTeammateHigh(team, 'story');
        setTeammateHigh(team, 'illustration');
    }
}

function setStudentHigh(team, subject) {
    team.student[`${subject}Role`] = `${subject}High`;
    team.teammate[`${subject}Role`] = `${subject}Low`;
}

function setTeammateHigh(team, subject) {
    team.teammate[`${subject}Role`] = `${subject}High`;
    team.student[`${subject}Role`] = `${subject}Low`;
}

export { assignRole };
