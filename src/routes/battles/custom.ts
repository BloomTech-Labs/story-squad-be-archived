import { EntityRepository, EntityManager } from 'typeorm'

import { Child, Stories, Illustrations } from '../../database/entity';


@EntityRepository()
export class MatchInfoRepository {

    constructor(private manager: EntityManager) {}

    async findStudentInfo(studentId: number, week: number) {

        const thisStudent = this.manager.findOne(Child, {
            where : { id: studentId}
        })
        const thisStory = this.manager.findOne(Stories, {
            where: { id: studentId, week: week }
        })
        const thisIllustration = this.manager.findOne(Illustrations, {
            where: { id: studentId, week: week }
        })
        //line 13-21 should run concurrently and all the promises should be resolved in line 23
        const [ info ] = await Promise.all([thisStudent, thisStory, thisIllustration])
        return  {
            studentId: info.id,
            username: info.username,
            avatar: info.avatar,
            story: info.stories[0],
            illustration: info.illustrations[0]
        }
    }

    async updatePoints(storyId: number, storyPoints: number, drawingId: number, drawingPoints: number){
        
        const story = this.manager.findOne(Stories, { where: { id: storyId } })
        const drawing = this.manager.findOne(Illustrations, { where: { id: drawingId } })
        const getPoints = await Promise.all([story, drawing])

        const storyUpdate = this.manager.update(
            Stories, 
            { where: {id: storyId }},
            { points: getPoints[0].points + storyPoints })
        const illistrationUpdate = this.manager.update(
            Illustrations, 
            { where: {id: drawingId }},
            { points: getPoints[1].points + drawingPoints })

            return await Promise.all([storyUpdate, illistrationUpdate])

    }
}
