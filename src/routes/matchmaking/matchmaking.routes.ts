import { Router } from 'express'
import { getRepository } from 'typeorm';
import { runScript } from '../../util/scripts/scripting'
const matchmaking_test = require('./matchmaking_test.json')
import { attemptJSONParse } from '../../util/utils';

import { Only } from '../../middleware'
import { Admin, Matches } from '../../database/entity'
import { Matchmaking, WeekMatches } from '../../models';
import { connection } from '../../util/typeorm-connection';

// a route allowing users to generate matchmaking via a button
// this can likely double for time-trigger
// ideas:
// 1) we could make the frontend trigger a call to the route if the time limit has been reached to generate matchmaking
// store result within 'Matches' entity


const matchMakingRoutes = Router();

// post route blocked by Only(Admin)
// to pass submissions within fe specified round
// into matchmaking and populate matches in db
matchMakingRoutes.post('/:roundInfo', Only(Admin), async (req, res) => {
    // roundInfo is anything we can use to refer to the round
    // route receives round info,
    // filter out the submissions within the round
    // pass into matchmaking
    // persist the matches
        

        //1 get submisisons array based on the criteria
        // const submissions = getRepository(submission, connection()).find({ criteria })
        


        // clean the data before sending it to python script (turn it into an array needed by the script)
        // requirement:: an object with studentIds as keys = { studentId: Readability }
        // const new = submissions.map(submission => )
        //2 matchmaking integration
        // submissions object into matchmaking

        const competitions = await match(matchmaking_test)

        //3 persist the match
       
        for ( let [key, value ] of Object.entries(competitions) ) {
            await getRepository(Matches, connection()).save({
                team1_child1_id: parseInt(value.team_1[0]),
                team1_child2_id: parseInt(value.team_1[1]),
                team2_child1_id: parseInt(value.team_2[0]),
                team2_child2_id: parseInt(value.team_2[1])
            })
        }

        res.status(200).json({ message: `success`})
        //4 return success

    try {
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

function match(data: Matchmaking){
    return runScript(
        './src/util/scripts/matchmaking.py', 
        data, 
        (out: any) => out.map(attemptJSONParse))
}

export { matchMakingRoutes };
