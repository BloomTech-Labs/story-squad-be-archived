function assignRole(higherTeam, team) {
    if (higherTeam[0][0].role === 'student' || 'opponentA') {
        setHigh(team, 'story', 'student', 'teammate');
    }
    if (higherTeam[1][0].role === 'student' || 'opponentA') {
        setHigh(team, 'illustration', 'student', 'teammate');
    }

    if (higherTeam[0][0].role === 'teammate' || 'opponentB') {
        setHigh(team, 'story', 'teammate', 'student');
    }

    if (higherTeam[1][0].role === 'teammate' || 'opponentB') {
        setHigh(team, 'illustration', 'teammate', 'student');
    }
}

function setHigh(team, subject, member1, member2) {
    team[`${member1}`][`${subject}Role`] = `${subject}High`;
    team[`${member2}`][`${subject}Role`] = `${subject}Low`;
}

export { assignRole };
