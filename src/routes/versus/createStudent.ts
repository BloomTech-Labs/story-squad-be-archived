function createStudent(team, story, illustration) {
    team.student.story = story.story;
    team.student.storyPoints = story.points;
    team.student.illustration = illustration.illustration;
    team.student.illustrationPoints = illustration.points;
    team.student.role = 'student';
    return team.student;
}

export { createStudent };
