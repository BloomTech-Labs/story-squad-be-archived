function createTeam(teammate, member) {
    return {
        ...teammate,
        role: member,
    };
}

export { createTeam };
