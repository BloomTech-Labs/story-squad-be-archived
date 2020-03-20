import { Router } from 'express';
import { getRepository } from 'typeorm';
import { transcribe, readable } from './storyDSintegration';

import { transformAndValidate } from 'class-transformer-validator';
import { StoryDTO } from '../../models';

import { Transcription, Readability, WeekMatches } from '../../models/internal/DS';
import { connection } from '../../util/typeorm-connection';
import { Only } from '../../middleware';
import { Child, Stories } from '../../database/entity';
import { Pages } from '../../database/entity/Pages';

const storyRoutes = Router();

storyRoutes.get('/:week', Only(Child), async (req, res) => {
    try {
        const { stories } = req.user as Child;
        const story = stories.find(({ week }) => week === parseInt(req.params.week));
        if (!story) throw Error('404');
        return res.json({ story });
    } catch (err) {
        if (err.toString() === 'Error: 404')
            return res.status(404).json({ message: `Story not found` });
        else
            return res
                .status(500)
                .json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

storyRoutes.post('/', Only(Child), async (req, res) => {
    try {
        const { storyText, story } = res.locals.body as Stories;
        const { cohort, stories } = req.user as Child;
        const { week } = cohort;

        if (stories.find((e) => e.week === week)) throw Error('400');

        let images = [];
        Object.values(story).forEach((page) => {
            if (page.length > 1) {
                images.push(page);
            }
        });

        let transcribed: Transcription | any;
        let readabilityStats: Readability | Transcription | WeekMatches;

        if (!storyText) {
            try {
                transcribed = await transcribe({ images });
            } catch (err) {
                console.log(err.toString());
                res.status(500).json({
                    err: err.toString(),
                    message: 'Could not transcribe story images',
                });
            }
        }

        //added WeekMatches as in DS.ts to stop typescript from throwing error
        const storyCont = { images: [storyText] };

        if (!transcribed) console.log('hi');
        try {
            readabilityStats = await readable({
                story: transcribed ? transcribed.images[0] : storyText,
            });
        } catch (err) {
            console.log(err.toString());
            return res.json({ err: err.toString(), message: 'Could not determine readability' });
        }

        try {
            const { child, ...stories } = await getRepository(Stories, connection()).save({
                week,
                story,
                storyText,
                child: req.user,

                ...readabilityStats[0],
                transcribed_text: transcribed
                    ? {
                          t_page1: transcribed.images[0]
                              ? storyText
                                  ? storyText
                                  : transcribed.images[0]
                              : '',
                          t_page2: transcribed.images[1] ? transcribed.images[1] : '',
                          t_page3: transcribed.images[2] ? transcribed.images[2] : '',
                          t_page4: transcribed.images[3] ? transcribed.images[3] : '',
                          t_page5: transcribed.images[4] ? transcribed.images[4] : '',
                      }
                    : null,
            });

            return res.status(201).json({ transcribed, stories });
        } catch (err) {
            console.log(err.toString());
            return res.status(500).json({ message: err.toString() });
        }
    } catch (err) {
        if (err.toString() === 'Error: 400')
            return res.status(400).json({ message: `Submission already exists` });
        else
            return res
                .status(500)
                .json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

storyRoutes.delete('/:week', Only(Child), async (req, res) => {
    // do I need to uncheck progress on this end upon delete? Or does this happen from a fe req? - 3.18.20
    try {
        const reqWeek = parseInt(req.params.week);

        const { stories } = req.user as Child;
        const story = stories.find((submission) => {
            return reqWeek === submission.week;
        });
        console.log("hello")

        if (!story) throw Error('404');
        try {
            const eek = await getRepository(Stories, connection()).delete({
                week: reqWeek,
            });
            console.log(eek)
        } catch (err) {
            console.log(err.toString());
            return res.status(500).json({
                err: err.toString(),
                message: 'Could not resolve delete query',
            });
        }
        console.log("hello", story)
        return res.json({ story });
    } catch (err) {
        if (err.toString() === 'Error: 404') {
            return res.status(404).json({ message: `Story not found` });
        } else {
            return res
                .status(500)
                .json({ message: 'Hmm... That did not work, please try again later.' });
        }
    }
});

export { storyRoutes };
