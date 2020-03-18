// import { Router } from 'express';
// import { getRepository } from 'typeorm';
// import {
//     Transcribable,
//     Transcription,
//     Readability,
//     Readable,
//     WeekMatches,
// } from '../../models/internal/DS';
// import { runScript } from '../../util/scripts/scripting';
// import { attemptJSONParse, onlyTranscription } from '../../util/utils';
// import { connection } from '../../util/typeorm-connection';
// import { Only } from '../../middleware';
// import { Child, Illustrations, Stories } from '../../database/entity';
// import { Pages } from '../../database/entity/Pages';

// const submissionRoutes = Router();

// submissionRoutes.get('/', Only(Child), async (req, res) => {
//     try {
//         const { submissions } = req.user as Child;
//         return res.json({ submissions });
//     } catch (err) {
//         return res
//             .status(500)
//             .json({ message: 'Hmm... That did not work, please try again later.' });
//     }
// });

// submissionRoutes.get('/:week', Only(Child), async (req, res) => {
//     try {
//         const { submissions } = req.user as Child;
//         const submission = submissions.find(({ week }) => week === parseInt(req.params.week));
//         if (!submission) throw Error('404');
//         return res.json({ submission });
//     } catch (err) {
//         if (err.toString() === 'Error: 404')
//             return res.status(404).json({ message: `Submission not found` });
//         else
//             return res
//                 .status(500)
//                 .json({ message: 'Hmm... That did not work, please try again later.' });
//     }
// });

// submissionRoutes.post('/', Only(Child), async (req, res) => {
//     try {
//         const { storyText, illustration, story } = res.locals.body as Submissions;

//         const { cohort, submissions } = req.user as Child;
//         const { week } = cohort;

//         if (submissions.find((e) => e.week === week)) throw Error('400');

//         let images = [];
//         Object.values(story).forEach((page) => {
//             if (page.length > 1) {
//                 images.push(page);
//             }
//         });

//         let transcribed: Transcription | any;
//         let readabilityStats: Readability | Transcription | WeekMatches;
//         let type: 'story' | 'illustration';

//         if (storyText) {
//             type = 'story';
//         }

//         if (!illustration) {
//             type = 'story';
//             transcribed = await transcribe({ images });

//             if (!transcribed) {
//                 return res
//                     .status(400)
//                     .json({ message: 'Something went wrong transcribing image.' });
//             }
//             //added WeekMatches as in DS.ts to stop typescript from throwing error
//             readabilityStats = await readable({
//                 story: transcribed.images[0],
//             });
//         } else {
//             type = 'illustration';
//             readabilityStats = {
//                 flesch_reading_ease: NaN,
//                 smog_index: NaN,
//                 flesch_kincaid_grade: NaN,
//                 coleman_liau_index: NaN,
//                 automated_readability_index: NaN,
//                 dale_chall_readability_score: NaN,
//                 difficult_words: NaN,
//                 linsear_write_formula: NaN,
//                 gunning_fog: NaN,
//                 consolidated_score: 'n/a',
//                 doc_length: NaN,
//                 quote_count: NaN,
//             };
//         }

//         try {
//             const { child, ...submission } = await getRepository(Submissions, connection()).save({
//                 week,
//                 story,
//                 storyText,
//                 illustration,
//                 type,
//                 child: req.user,

//                 ...readabilityStats[0],
//                 transcribed_text: transcribed
//                     ? {
//                           t_page1: transcribed.images[0] ? transcribed.images[0] : '',
//                           t_page2: transcribed.images[1] ? transcribed.images[1] : '',
//                           t_page3: transcribed.images[2] ? transcribed.images[2] : '',
//                           t_page4: transcribed.images[3] ? transcribed.images[3] : '',
//                           t_page5: transcribed.images[4] ? transcribed.images[4] : '',
//                       }
//                     : null,
//             });

//             return res.status(201).json({ transcribed, submission });
//         } catch (err) {
//             console.log(err.toString());
//             return res.status(500).json({ message: err.toString() });
//         }
//     } catch (err) {
//         if (err.toString() === 'Error: 400')
//             return res.status(400).json({ message: `Submission already exists` });
//         else
//             return res
//                 .status(500)
//                 .json({ message: 'Hmm... That did not work, please try again later.' });
//     }
// });

// submissionRoutes.delete('/illustration/:week', Only(Child), async (req, res) => {
//     try {
//         const reqWeek = parseInt(req.params.week);

//         const { submissions, username } = req.user as Child;
//         console.log(username);
//         const submission = submissions.find(
//             ({ week, type }) => week === reqWeek && type === 'illustration'
//         );
//         if (!submission) throw Error('404');
//         //how is it only deleting from 1 user
//         const { affected } = await getRepository(Submissions, connection()).delete({
//             childId: req.user.id,
//             week: reqWeek,
//             type: 'illustration',
//         });
//         if (!affected) throw Error();
//         return res.json({ submission });
//     } catch (err) {
//         if (err.toString() === 'Error: 404')
//             return res.status(404).json({ message: `Illustration not found` });
//         else res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
//     }
// });

// submissionRoutes.delete('/story/:week', Only(Child), async (req, res) => {
//     // need to uncheck progress upon delete
//     try {
//         const reqWeek = parseInt(req.params.week);

//         const { submissions, username } = req.user as Child;
//         console.log(submissions);
//         const weekSubmissions = submissions.filter((submission) => {
//             console.log('submission', submission);
//             return reqWeek === submission.week;
//         });
//         console.log('weekSubmissions', weekSubmissions);

//         const submission = weekSubmissions.find(({ type }) => type === 'story');
//         console.log('submission', submission);
//         if (!submission) throw Error('404');
//         try {
//             const { affected } = await getRepository(Submissions, connection()).delete({
//                 week: reqWeek,
//                 type: 'story',
//             });
//         } catch (err) {
//             console.log(err.toString());
//             return res.status(500).json({
//                 err: err.toString(),
//                 message: 'Could not resolve delete query',
//             });
//         }

//         return res.json({ submission });
//     } catch (err) {
//         if (err.toString() === 'Error: 404') {
//             return res.status(404).json({ message: `Story not found` });
//         } else {
//             return res
//                 .status(500)
//                 .json({ message: 'Hmm... That did not work, please try again later.' });
//         }
//     }
// });

// function transcribe(data: Transcribable) {
//     return runScript('./src/util/scripts/transcription.py', data, (out: string[]) =>
//         out.map(attemptJSONParse).find(onlyTranscription)
//     );
// }

// function readable(story: Readable) {
//     return runScript('./src/util/scripts/readability.py', story, (out: any) =>
//         out.map(attemptJSONParse)
//     );
// }

// export { submissionRoutes };
