interface Team {
    matchId: Number;
    week: Number;
    student: student;
    teammate: student;
}

interface student {
    studentId: Number;
    username: String;
    avatar: String;
    story: story;
    storyPoints: Number;
    illustration: Object;
    illustrationPoints: String;
    role: String;
    storyRole: String;
    illustrationRole: illustration;
    storyOpponent: Object;
    illustrationOpponent: Object;
    storyTotal?: Number;
    illustrationTotal?: Number;
}

interface story {
    page1: String;
    page2?: String;
    page3?: String;
}

interface illustration {
    illustration: String;
}

export { Team };
