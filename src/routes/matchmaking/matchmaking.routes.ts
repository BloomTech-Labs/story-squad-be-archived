// a route allowing users to generate matchmaking via a button
// this can likely double for time-trigger
// ideas:
// 1) we could make the frontend trigger a call to the route if the time limit has been reached to generate matchmaking
// store result within 'Matches' entity
import { Router } from 'express';

const matchMakingRoutes = Router();

// post route blocked by Only(Admin)
// to pass submissions within fe specified round
// into matchmaking and populate matches in db
matchMakingRoutes.post('/:roundInfo', Only(Admin), async (req, res) => {
    // roundInfo is anything we can use to refer to the round
    try {
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

export { matchMakingRoutes };
