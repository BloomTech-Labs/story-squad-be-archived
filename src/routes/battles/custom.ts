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
            story: story,
            illustration: illustration,
        };
    }

    async updatePoints(
        storyId: number,
        storyPoints: number,
        drawingId: number,
        drawingPoints: number
    ) {
        // console logs below were left due to a merge conflict from put-battles-fixed branch
        // const story = await this.manager.findOne(Stories, { where: { id: storyId } })
        // const drawing = await this.manager.findOne(Illustrations, { where: { id: drawingId } })

        // console.log('story points', story.points)
        // console.log('drawing points', drawing.points)

        const storyPromise = this.manager.findOne(Stories, { where: { id: storyId } });
        const drawingPromise = this.manager.findOne(Illustrations, { where: { id: drawingId } });
        const [story, drawing] = await Promise.all([storyPromise, drawingPromise]);

        // replaced () => points + storyPoints with story.points + storyPoints 4.1.20
        const storyUpdate = this.manager.update(
            Stories,
            { where: { id: storyId } },
            { points: story.points + storyPoints }
        );
        const illustrationUpdate = this.manager.update(
            Illustrations,
            { where: { id: drawingId } },
            { points: drawing.points + drawingPoints }
        );

        return await Promise.all([storyUpdate, illustrationUpdate]);
    }
}
