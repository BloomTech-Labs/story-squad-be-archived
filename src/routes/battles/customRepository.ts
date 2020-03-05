// import {EntityRepository, EntityManager } from "typeorm";
// import { Submission } from '../../database/entity'
// import { Child } from '../../database/entity/User'
// import { connection } from "../../util/typeorm-connection";


// @EntityRepository()
// export class MatchInfoRepository {

//     constructor(private manager: EntityManager) {
//     }

//     findMatchInfo(id: number, cohort_canon: number) {
        
//         let matchInfo = {
//             username: "",
//             avatar: "",
//             story: {},
//             drawing: {}
//         }

//         this.manager.getRepository(Submission, connection())
//             .findOne({ where: { child_id: id, round_id: id, type: "story"}})
//             .then(res = {
//                 matchInfo.story = res.story
//             })
//         this.manager.getRepository(Submission, connection())
//             .findOne({ where: { child_id: id, round_id: id, type: "illustration"}})
//             .then(res = {
//                 matchInfo.drawing = res.story
//             })
        
//         this.manager.getRepository(Child, connection())
//             .findOne({ id })
//             .then(res = {
//                 matchInfo.username = res.username
//                 matchInfo.avatar = res.avatar
//             })

//         return matchInfo;

//     }

//     updateSubmissions(id: number, cohort_canon: number, storypoints, drawingpoints){
//         // this.manager.update(Story_Submission).set({ allocated_poins: storypoints }).where({ child_id: id, cohort_canon: cohort_canon })
//         // this.manager.update(Drawing_Submission).set({ allocated_poins: drawingpoints }).where({ child_id: id, cohort_canon: cohort_canon })
//     }

// }