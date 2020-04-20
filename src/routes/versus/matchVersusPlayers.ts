function matchVersusPlayers(teamA, teamB) {
    if (teamA.student.subjecRole === teamB.student.storyRole) {
        teamA.student.storyOpponent = teamB.student;
        teamA.teammate.storyOpponent = teamB.teammate;
        teamA.student.storyTotal = teamA.student.storyPoints + teamB.student.storyPoints;
        teamA.teammate.storyTotal = teamA.teammate.storyPoints + teamB.teammate.storyPoints;
    } else {
        teamA.student.storyOpponent = teamB.teammate;
        teamA.teammate.storyOpponent = teamB.student;
        teamA.student.storyTotal = teamA.student.storyPoints + teamB.teammate.storyPoints;
        teamA.teammate.storyTotal = teamA.teammate.storyPoints + teamB.student.storyPoints;
    }

    if (teamA.student.illustrationRole === teamB.student.illustrationRole) {
        teamA.student.illustrationOpponent = teamB.student;
        teamA.teammate.illustrationOpponent = teamB.teammate;
        teamA.student.illustrationTotal =
            teamA.student.illustrationPoints + teamB.student.illustrationPoints;
        teamA.teammate.illustrationTotal =
            teamA.teammate.illustrationPoints + teamB.teammate.illustrationPoints;
    } else {
        teamA.student.illustrationOpponent = teamB.teammate;
        teamA.teammate.illustrationOpponent = teamB.student;
        teamA.student.illustrationTotal =
            teamA.student.illustrationPoints + teamB.teammate.illustrationPoints;
        teamA.teammate.illustrationTotal =
            teamA.teammate.illustrationPoints + teamB.student.illustrationPoints;
    }
}

export { matchVersusPlayers };
