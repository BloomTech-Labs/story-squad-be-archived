function matchVersusPlayers(teamA, teamB) {
    matchRole(teamA, teamB, 'story');
    matchRole(teamA, teamB, 'illustration');
}

function matchRole(teamA, teamB, subject) {
    if (teamA.student[`${subject}Role`] === teamB.student[`${subject}Role`]) {
        teamA.student[`${subject}Opponent`] = teamB.student;
        teamA.teammate[`${subject}Opponent`] = teamB.teammate;
    } else {
        teamA.student[`${subject}Opponent`] = teamB.teammate;
        teamA.teammate[`${subject}Opponent`] = teamB.student;
    }
}

export { matchVersusPlayers };
