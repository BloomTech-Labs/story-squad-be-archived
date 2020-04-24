import { EntityRepository, EntityManager } from 'typeorm';

import { Child, Stories, Illustrations } from '../../database/entity';

@EntityRepository()
export class MatchInfoRepository {
    constructor(private manager: EntityManager) {}

    async findStudentInfo(studentId: number, week: number) {
        const thisStudent = this.manager.findOne(Child, {
            where: { id: studentId },
        });
        const thisStory = this.manager.findOne(Stories, {
            where: { childId: studentId, week: week },
        });
        const thisIllustration = this.manager.findOne(Illustrations, {
            where: { childId: studentId, week: week },
        });
        //line 13-21 should run concurrently and all the promises should be resolved in line 23
        const [child, story, illustration] = await Promise.all([
            thisStudent,
            thisStory,
            thisIllustration,
        ]);

        return {
            studentId: studentId,
            username: child.username,
            avatar: child.avatar,
            // replacing story and illustration objects as empty strings to avoid sending base64 4/13/2020
            story: story.story,
            storyPoints: story.points,
            illustration: illustration.illustration,
            illustrationPoints: illustration.points,
        };
    }
}
