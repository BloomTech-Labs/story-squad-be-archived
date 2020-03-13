import { EntityRepository, EntityManager } from 'typeorm'

import { Child, Submissions } from '../../database/entity';

@EntityRepository()
export class MatchInfoRepository {
    constructor(private manager: EntityManager) {}

    findMatchInfo(student1id: number, student2id: number, week: number) {
        let submissions = null;
        let student1 = {
            id: student1id,
            story: {},
            illustration: {},
            username: "",
            avatar: "",
        };
        let student2 = {
            id: student2id,
            story: {},
            illustration: {},
            username: "",
            avatar: "",
        };
        return this.manager
            .find(Submissions, {
                where: { week: week },
            })
            .then((res) => {
                submissions = res;
                console.log(submissions)
                student1.story = submissions.filter(
                    (submission) => submission['childId'] === student1id
                );
                student1.illustration = submissions.filter(
                    (submission) =>
                        submission['childId'] === student1id
                );
                student2.story = submissions.filter(
                    (submission) => submission['childId'] === student2id
                );
                student2.illustration = submissions.filter(
                    (submission) =>
                        submission['childId'] === student2id
                )
                
                return this.manager.findOne(Child, {
                    where: { id: student1id }
                }).then(res => {
                    student1.username = res.username
                    student1.avatar = res.avatar

                    return this.manager.findOne(Child, {
                        where: { id: student2id }
                    }).then(res => {
                            student2.username = res.username
                            student2.avatar = res.avatar

                            return { student1, student2 }
                    })
                        
                })

                    
            })

                
                
        };
        
    }

