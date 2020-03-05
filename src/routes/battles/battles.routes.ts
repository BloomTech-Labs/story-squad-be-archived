import { Router } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';


import { Child, Round, Matches } from '../../database/entity'
import { MatchInfoRepository } from './custom'

import { Only } from '../../middleware/only/only.middleware'
import { connection } from '../../util/typeorm-connection';


const battlesRoutes = Router()

battlesRoutes.get("/battles", Only(Child), async(req, res) => {

    try{
        const { id } = req.user as Child
        //first get matchid so we know who this child is up against
        const activeCohort = await getRepository(Round, connection()).findOne({ where: { current: true }})
        const [ match ] = await getRepository(Matches, connection()).find({
            where: [
                { team1_child1_id: id, round: activeCohort.id },
                { team1_child2_id: id, round: activeCohort.id },
                { team2_child1_id: id, round: activeCohort.id },
                { team2_child2_id: id, round: activeCohort.id }
            ]
        })

        const t1c1 = await getCustomRepository(MatchInfoRepository, connection()).findMatchInfo(match.team1_child1_id, activeCohort.id)
        const t1c2 = await getCustomRepository(MatchInfoRepository, connection()).findMatchInfo(match.team1_child2_id, activeCohort.id)
        const t2c1 = await getCustomRepository(MatchInfoRepository, connection()).findMatchInfo(match.team2_child1_id, activeCohort.id)
        const t2c2 = await getCustomRepository(MatchInfoRepository, connection()).findMatchInfo(match.team2_child2_id, activeCohort.id)

        res.status(200).json({
            matchId: match.id,
            round_id: activeCohort.id,
            team1: [t1c1, t1c2],
            team2: [t2c1, t2c2]
        }) 
    } catch(err) {
        res.status(500).json({message: err})
    }
})

battlesRoutes.put("/battles", Only(Child), async(req, res) => {
    try{
        //receive the requestwith point allocation score and put the request to add score
        // request should consist of 
        // story1id, story1points, story2id, story2points
        // pic1id, pic1points, pic2id, pic2points

        //destructuring the request

        const { id } = req.user as Child

        //const result1 = await getRepository(Submission, connection())
            //.update({ allocation_point: current_point + storypoint })
            //.where({ id: story1id })

        
        res.status(200).json({ messae: 'success'})


    } catch(err) {
        res.status(500).json({message: err})
    }
})

export { battlesRoutes }

       