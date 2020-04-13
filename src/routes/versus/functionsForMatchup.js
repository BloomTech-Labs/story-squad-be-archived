function findPlayerPoints(populatedMatch) {
    const total = [];

    for (let i = 0; i < populatedMatch.length; i++) {
        const roundPoints = Object.values(populatedMatch[i]);

        roundPoints.map((r) => {
            r.totalPoints = r.player1.points + r.player2.points;
            total.push(r.totalPoints);
        });
    }
    return total;
}

let match = [
    {
        roundS1: {
            player1: {
                studentId: 'a',
                teamID: 'a',
                username: 'a',
                avatar: 'a',
                thumbnail: '',
                file: '',
                points: 50,
            },
            player2: {
                studentId: 'a',
                teamID: 'a',
                username: 'a',
                avatar: 'a',
                thumbnail: '',
                file: '',
                points: 50,
            },
            totalPoints: 10,
        }, // closes rs1
    },
    {
        roundS2: {
            player1: {
                studentId: 'a',
                teamID: 'a',
                username: 'a',
                avatar: 'a',
                thumbnail: '',
                file: '',
                points: 60,
            },
            player2: {
                studentId: 'a',
                teamID: 'a',
                username: 'a',
                avatar: 'a',
                thumbnail: '',
                file: '',
                points: 40,
            },
            totalPoints: 0,
        }, // closes rs2
    },
];
