function decideHigher(studentA, studentB) {
    const high = [];
    if (studentA.storyPoints > studentB.storyPoints) high.push([studentA, studentB]);
    else high.push([studentB, studentA]);

    if (studentA.illustrationPoints > studentB.illustrationPoints) high.push([studentA, studentB]);
    else high.push([studentB, studentA]);

    return high;
}

export { decideHigher };
