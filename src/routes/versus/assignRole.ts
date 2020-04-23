function assignRole(higherTeam, team) {
    if (higherTeam[0][0].role === 'student' || 'opponentA') {
        setStudentHigh(team, 'story');
    }

    if (higherTeam[1][0].role === 'student' || 'opponentA') {
        setStudentHigh(team, 'illustration');
    }

    if (higherTeam[0][0].role === 'teammate' || 'opponentB') {
        setTeammateHigh(team, 'story');
    }

    if (higherTeam[1][0].role === 'teammate' || 'opponentB') {
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
