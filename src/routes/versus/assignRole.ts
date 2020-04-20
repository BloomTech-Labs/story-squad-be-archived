function assignRole(higherTeam, team) {
    if (higherTeam[0][0].role === 'student' && higherTeam[1][0].role === 'student') {
        team.student.storyRole = 'storyHigh';
        team.teammate.storyRole = 'storyLow';
        team.student.illustrationRole = 'illustrationHigh';
        team.teammate.illustrationRole = 'illustrationLow';
    } else {
        team.student.storyRole = 'storyLow';
        team.teammate.storyRole = 'storyHigh';
        team.student.illustrationRole = 'illustrationLow';
        team.teammate.illustrationRole = 'illustrationHigh';
    }
}

export { assignRole };
