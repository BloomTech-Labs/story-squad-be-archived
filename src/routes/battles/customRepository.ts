import {EntityRepository, EntityManager, getRepository} from "typeorm";
import { Story_Submission, Drawing_Submission } from '../../database/entity/Submission'
import { Child } from '../../database/entity/User'
import { connection } from "../../util/typeorm-connection";

@EntityRepository()
export class MatchInfoRepository {

    constructor(private manager: EntityManager) {
    }

    findMatchInfo(id: number, cohort_canon: number) {
        
        let matchInfo = {
            username: "",
            avatar: "",
            story: {},
            drawing: {}
        }

        this.manager.getRepository(Story_Submission, connection())
            .findOne({ where: { child_id: id, round_id: id, type: "story "}})
            .then(res = {
                matchInfo.story = res.story
            })
        const drawing = this.manager.getRepository(Story_Submission, connection())
            .findOne({ where: { child_id: id, round_id: id, type: "illustration "}})
        

        return matchInfo;

    }

    updateSubmissions(id: number, cohort_canon: number, storypoints, drawingpoints){
        // this.manager.update(Story_Submission).set({ allocated_poins: storypoints }).where({ child_id: id, cohort_canon: cohort_canon })
        // this.manager.update(Drawing_Submission).set({ allocated_poins: drawingpoints }).where({ child_id: id, cohort_canon: cohort_canon })
    }

}