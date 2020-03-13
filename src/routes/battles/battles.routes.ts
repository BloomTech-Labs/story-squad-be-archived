import { Router } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';

import { Child, Matches } from '../../database/entity'
import { MatchInfoRepository } from './custom'

import { Only } from '../../middleware/only/only.middleware'
import { connection } from '../../util/typeorm-connection';


const battlesRoutes = Router()

battlesRoutes.get("/", Only(Child), async(req, res) => {

    try{
        const { id, cohort } = req.user as Child
        console.log(id, cohort)
        //first get matchid so we know who this child is up against
        const [ match ] = await getRepository(Matches, connection()).find({
            where: [
                { team1_child1_id: id, week: cohort.week },
                { team1_child2_id: id, week: cohort.week },
                { team2_child1_id: id, week: cohort.week },
                { team2_child2_id: id, week: cohort.week } 
            ]
        })

        console.log(match)

        let thisMatch = {
            matchId: match.id,
            week: cohort.week,
            team: null
        }

        if (!match){
            res.json(401).json({ message: `Match for Student ID ${id}, for week ${cohort.week} not found`})
        }
        if ((match.team1_child1_id === id) || (match.team1_child2_id == id ) ){
            console.log("team1", match.team1_child1_id, match.team1_child2_id)
            const team1 = await getCustomRepository(MatchInfoRepository, connection())
                .findMatchInfo(match.team1_child1_id, match.team1_child2_id, cohort.week)
            console.log(team1)
            thisMatch.team = team1
        } else {
            console.log("team2", match.team2_child1_id, match.team2_child2_id)
            const team2 = await getCustomRepository(MatchInfoRepository, connection())
                .findMatchInfo(match.team2_child1_id, match.team2_child2_id, cohort.week)
            thisMatch.team = team2
            console.log(team2)
        }
        

        res.status(200).json({
            thisMatch
        }) 
    } catch(err) {
        res.status(500).json({ message: err })
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

       