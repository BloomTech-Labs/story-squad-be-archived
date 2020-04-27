import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Child, Stories } from '../../database/entity';
import { Only } from '../../middleware/only/only.middleware';
import { connection } from '../../util/typeorm-connection';
import e = require('express');
import { TypeCast } from '../../util/utils';
import { FindMatchByUID } from '../../util/db-utils';
import { Transcribable } from '../../models';

const versusRoutes = Router();

class StorySend {
    id: Number;
    childId: Number;
    points: Number;
    doc_length: Number;
    story: Stories;
    transcribed_text: Transcribable;

    constructor() {
        this.id = null;
        this.childId = null;
        this.points = null;
        this.doc_length = null;
        this.story = null;
        this.transcribed_text = null;
    }
}

let LEFT = 0;
let RIGHT = 1;

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

        let HighStoryMatchup = {
            points: team1Stories[0].points + team2Stories[0].points,
            [LEFT]: TypeCast(StorySend, team1Stories[0]),
            [RIGHT]: TypeCast(StorySend, team2Stories[0]),
        } as any;
        let LowStoryMatchup = {
            points: team1Stories[1].points + team2Stories[1].points,
            [LEFT]: TypeCast(StorySend, team1Stories[1]),
            [RIGHT]: TypeCast(StorySend, team2Stories[1]),
        } as any;

        //Extract illustrations, highest points to lowest
        const team1Illustrations = sortByPoints(team1, 'illustrations', cohort.week);
        const team2Illustrations = sortByPoints(team2, 'illustrations', cohort.week);

        let HighIllustrationMatchup = {
            points: team1Illustrations[0].points + team2Illustrations[0].points,
            [LEFT]: team1Illustrations[0],
            [RIGHT]: team2Illustrations[0],
        } as any;
        let LowIllustrationMatchup = {
            points: team1Illustrations[1].points + team2Illustrations[1].points,
            [LEFT]: team1Illustrations[1],
            [RIGHT]: team2Illustrations[1],
        } as any;

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
