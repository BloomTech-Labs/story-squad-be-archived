import { EntityRepository, EntityManager } from 'typeorm';

import { Child, Submissions } from '../../database/entity';

@EntityRepository()
export class MatchInfoRepository {
    constructor(private manager: EntityManager) {}

    findMatchInfo(student1id: number, student2id: number, week: number) {
        let submissions = null;
        let student1 = {
            story: {},
            illustration: {},
            username: {},
            avatar: {},
        };
        let student2 = {
            story: {},
            illustration: {},
            username: {},
            avatar: {},
        };
        this.manager
            .findOne(Submissions, {
                where: { week: week },
            })
            .then((res) => {
                submissions = res;
            });

        student1.story = submissions.filter(
            (submission) => submission['child']['id'] === student1id && submission.type === 'story'
        );
        student1.illustration = submissions.filter(
            (submission) =>
                submission['child']['id'] === student1id && submission.type === 'illustration'
        );
        student2.story = submissions.filter(
            (submission) => submission['child']['id'] === student2id && submission.type === 'story'
        );
        student2.illustration = submissions.filter(
            (submission) =>
                submission['child']['id'] === student2id && submission.type === 'illustration'
        );

        this.manager
            .findOne(Child, {
                where: { id: student1id },
            })
            .then((res) => {
                student1.username = res.username;
            });

        this.manager
            .findOne(Child, {
                where: { id: student2id },
            })
            .then((res) => {
                student2.username = res.username;
            });

        return [student1, student2];
    }
}
