interface Team {
    matchId: Number;
    week: Number;
    student: Student;
    teammate: Student;
}

interface Student {
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
    storyOpponent?: Student;
    illustrationOpponent?: Student;
}

interface story {
    page1: String;
    page2?: String;
    page3?: String;
}

class Student {
    constructor() {
        this.studentId = null;
        this.username = null;
        this.avatar = null;
        this.story = null;
        this.storyPoints = null;
        this.illustration = null;
        this.illustrationPoints = null;
        this.role = null;
        this.storyRole = null;
        this.illustrationRole = null;
        this.storyOpponent = null;
        this.illustrationOpponent = null;
    }
}

class Team {
    constructor(public matchId: Number, public student: Student, public teammate: Student) {}
}

export { Team, Student };
