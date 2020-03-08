import {EntityRepository, EntityManager} from "typeorm";

import { Child, Submission } from '../../database/entity'

@EntityRepository()
export class MatchInfoRepository{
    constructor(private manager: EntityManager){

    }
    
    findMatchInfo(id: number, roundId: number){
        let matchInfo = {
            story: {},
            drawing: {},
            avatar: "",
            username: "",
            id: null
        }
        this.manager.findOne(Submission, {
            where: { child: id, round: roundId, type: "story" }
        }).then(res => matchInfo.story = res)
        this.manager.findOne(Submission, {
            where: { child: id, round: roundId, type: "illustration" }
        }).then(res => matchInfo.drawing = res)
        this.manager.findOne(Child, {
            select: ["username", "avatar"],
            where: { child: id, round: roundId }
        }).then(res => {
            matchInfo.avatar = res.avatar
            matchInfo.username = res.username
            matchInfo.id = res.id
        })

        return matchInfo
    }

}