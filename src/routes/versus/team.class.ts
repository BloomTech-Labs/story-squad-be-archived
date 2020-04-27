interface Team {
    matchId: Number;
    week: Number;
    student: student;
    teammate: student;
}

interface student {
    studentId: number;
    username: string;
    avatar: string;
    story: story;
    storyPoints: number;
    illustration: string;
    illustrationPoints: number;
    role?: string;
    storyRole?: string;
    illustrationRole?: string;
    storyOpponent?: student;
    illustrationOpponent?: student;
}

interface story {
    page1: String;
    page2?: String;
    page3?: String;
}

class Team {
    constructor(public matchId: Number) {
        this.student = {
            studentId: null,
            username: null,
            avatar: null,
            story: null,
            storyPoints: null,
            illustration: null,
            illustrationPoints: null,
            role: null,
            storyRole: null,
            illustrationRole: null,
            storyOpponent: null,
            illustrationOpponent: null,
        };
        this.teammate = {
            studentId: null,
            username: null,
            avatar: null,
            story: null,
            storyPoints: null,
            illustration: null,
            illustrationPoints: null,
            role: null,
            storyRole: null,
            illustrationRole: null,
            storyOpponent: null,
            illustrationOpponent: null,
        };
    }
}

export { Team };
