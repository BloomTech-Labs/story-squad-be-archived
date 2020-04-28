import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Child } from '../../database/entity';
import { Only } from '../../middleware/only/only.middleware';
import { connection } from '../../util/typeorm-connection';
import { TypeCast } from '../../util/utils';
import { FindMatchByUID } from '../../util/db-utils';
import { StorySend, LEFT, RIGHT, TeamData } from './versusRoutes.imports';
import { sortByPoints, MatchSortByTeam } from './versusRoutes.functions';

const versusRoutes = Router();

versusRoutes.get('/versus', Only(Child), async (req, res) => {
    try {
        const { id, cohort, username, avatar, stories, illustrations, votes } = req.user as Child;

        const match = await FindMatchByUID(id, cohort.week);
        let teamID = match.team1_child1_id === id || match.team1_child2_id === id ? 1 : 2;

        if (!match) {
            res.json(401).json({
                message: `Match for Student ID ${id}, for week ${cohort.week} not found`,
            });
            return;
        }

        let ChildRepo = getRepository(Child, connection());

        let team1: Child[] = await ChildRepo.find({
            where: [{ id: match.team1_child1_id }, { id: match.team1_child2_id }],
            relations: ['illustrations', 'stories'],
        });

        const team2: Child[] = await ChildRepo.find({
            where: [{ id: match.team2_child1_id }, { id: match.team2_child2_id }],
            relations: ['illustrations', 'stories'],
        });

        let hTeam = teamID === 1 ? [team1[0], team1[1]] : [team2[0], team2[1]];
        let aTeam = teamID === 1 ? [team2[0], team2[1]] : [team1[0], team1[1]];

        let matchdata = {
            votes,
            homeTeam: [TypeCast(TeamData, hTeam[0]), TypeCast(TeamData, hTeam[1])],
            awayTeam: [TypeCast(TeamData, aTeam[0]), TypeCast(TeamData, aTeam[1])],
        };

        //Extract stories, highest points to lowest
        const team1Stories = sortByPoints(team1, 'stories', cohort.week);
        const team2Stories = sortByPoints(team2, 'stories', cohort.week);

        //Calculate the HighStory matchup
        let HighStoryMatchup = MatchSortByTeam(
            {
                points: team1Stories[0].points + team2Stories[0].points,
                [LEFT]: TypeCast(StorySend, team1Stories[0]),
                [RIGHT]: TypeCast(StorySend, team2Stories[0]),
            },
            matchdata.homeTeam
        );

        //Calculate the LowStory matchup
        let LowStoryMatchup = MatchSortByTeam(
            {
                points: team1Stories[1].points + team2Stories[1].points,
                [LEFT]: TypeCast(StorySend, team1Stories[1]),
                [RIGHT]: TypeCast(StorySend, team2Stories[1]),
            },
            matchdata.homeTeam
        );

        //Extract illustrations, highest points to lowest
        const team1Illustrations = sortByPoints(team1, 'illustrations', cohort.week);
        const team2Illustrations = sortByPoints(team2, 'illustrations', cohort.week);

        //Calculate the HighIllustration matchup
        let HighIllustrationMatchup = MatchSortByTeam(
            {
                points: team1Illustrations[0].points + team2Illustrations[0].points,
                [LEFT]: team1Illustrations[0],
                [RIGHT]: team2Illustrations[0],
            },
            matchdata.homeTeam
        );

        //Calculate the LowIllustration matchup
        let LowIllustrationMatchup = MatchSortByTeam(
            {
                points: team1Illustrations[1].points + team2Illustrations[1].points,
                [LEFT]: team1Illustrations[1],
                [RIGHT]: team2Illustrations[1],
            },
            matchdata.homeTeam
        );

        //////////////////////////////////////////////////
        //The "don't crash my postman" block - DEV ONLY
        HighStoryMatchup[LEFT].story.page1 = HighStoryMatchup[RIGHT].story.page1 = LowStoryMatchup[
            LEFT
        ].story.page1 = LowStoryMatchup[RIGHT].story.page1 = 'STORY STORY STORY STORY STORY';

        HighIllustrationMatchup[LEFT].illustration = HighIllustrationMatchup[
            RIGHT
        ].illustration = LowIllustrationMatchup[LEFT].illustration = LowIllustrationMatchup[
            RIGHT
        ].illustration = 'DRAWING DRAWING DRAWING DRAWING';
        //////////////////////////////////////////////////

        let thisBattle = [
            HighStoryMatchup,
            LowStoryMatchup,
            HighIllustrationMatchup,
            LowIllustrationMatchup,
        ];

        //Sort the battle, high points to low
        thisBattle.sort(function (a, b) {
            return b.points - a.points;
        });

        //Resolve usernames & any other data we may have lost through the sorting process
        [team1[0], team1[1], team2[0], team2[1]].forEach((i) => {
            Object.keys(thisBattle).forEach((e) => {
                let Resolve = thisBattle[e] as StorySend[];
                if (Resolve[0].id === i.id) Resolve[0].username = i.username;
                else if (Resolve[1].id === i.id) Resolve[1].username = i.username;
            });
        });

        return res.status(200).json({ matchdata: matchdata, matchups: thisBattle });
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
});

export { versusRoutes };
