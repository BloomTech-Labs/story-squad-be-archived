import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Child } from '../../database/entity';
import { Only } from '../../middleware/only/only.middleware';
import { connection } from '../../util/typeorm-connection';
import e = require('express');
import { FindMatchByUID } from '../../util/db-utils';

const versusRoutes = Router();

versusRoutes.get('/versus', Only(Child), async (req, res) => {
    try {
        const { id, cohort, username, avatar, stories, illustrations } = req.user as Child;

        const match = await FindMatchByUID(id, cohort.week);

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

        //Extract stories, highest points to lowest
        const team1Stories = sortByPoints(team1, 'stories', cohort.week);
        const team2Stories = sortByPoints(team2, 'stories', cohort.week);

        let HighStoryMatchup = [team1Stories[0], team2Stories[0]] as any;
        let LowStoryMatchup = [team1Stories[1], team2Stories[1]] as any;

        //Extract illustrations, highest points to lowest
        const team1Illustrations = sortByPoints(team1, 'illustrations', cohort.week);
        const team2Illustrations = sortByPoints(team2, 'illustrations', cohort.week);

        let HighIllustrationMatchup = [team1Illustrations[0], team2Illustrations[0]] as any;
        let LowIllustrationMatchup = [team1Illustrations[1], team2Illustrations[1]] as any;

        HighStoryMatchup[0].story.page1 = HighStoryMatchup[1].story.page1 = LowStoryMatchup[0].story.page1 = LowStoryMatchup[1].story.page1 =
            'STORY STORY STORY STORY STORY';

        HighIllustrationMatchup[0].illustration = HighIllustrationMatchup[1].illustration = LowIllustrationMatchup[0].illustration = LowIllustrationMatchup[1].illustration =
            'DRAWING DRAWING DRAWING DRAWING';

        let thisBattle = {
            highStory: HighStoryMatchup,
            lowStory: LowStoryMatchup,
            highIll: HighIllustrationMatchup,
            lowIll: LowIllustrationMatchup,
        };

        return res.status(200).json(thisBattle);
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
});

function sortByPoints(team: Child[], key: string, week: number) {
    const [user1, user2] = team;
    const [submission1] = user1[`${key}`].filter((element) => element.week === week);
    const [submission2] = user2[`${key}`].filter((element) => element.week === week);
    return submission1.points > submission2.points
        ? [submission1, submission2]
        : [submission2, submission1];
}

export { versusRoutes };
