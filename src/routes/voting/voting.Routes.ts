import { Router } from 'express';
import { Only } from '../../middleware';
import { Child, Stories, Illustrations } from '../../database/entity';
import { getRepository } from 'typeorm';
import { connection } from '../../util/typeorm-connection';
import { Versus } from '../../database/entity/Versus';
import { FindMatchByUID } from '../../util/db-utils';
import { TypeCast } from '../../util/utils';
import { storyReturn, illustrationReturn } from './votingRoutes.imports';
import { randomIgnoring, validEmojiArray } from './votingRoutes.functions';
import { Emojis } from '../../database/entity/Emojis';

const votingRoutes = Router();

votingRoutes.get('/voting', Only(Child), async (req, res) => {
    try {
        let User = req.user as Child;
        let ChildMatch = await FindMatchByUID(User.id, User.cohort.week);

        //Get a random versus matchup that is NOT from this childs match
        let response = await randomIgnoring(ChildMatch);

        if (!response) {
            //Error?
            res.status(300).json({ msg: 'No match could be determined' });
            return;
        }

        let Build = {} as any;

        Build.matchupID = response.id;

        if (response.story) {
            //If story, grab them and relay them back
            let StoryRepo = getRepository(Stories, connection());
            Build.child1 = TypeCast(
                storyReturn,
                await StoryRepo.findOne({ where: { child: response.children[0] } })
            );
            Build.child2 = TypeCast(
                storyReturn,
                await StoryRepo.findOne({ where: { child: response.children[1] } })
            );
        } else {
            //If illustration, grab them and relay them back
            let IllustrationRepo = getRepository(Illustrations, connection());
            Build.child1 = TypeCast(
                illustrationReturn,
                await IllustrationRepo.findOne({ where: { child: response.children[0] } })
            );
            Build.child2 = TypeCast(
                illustrationReturn,
                await IllustrationRepo.findOne({ where: { child: response.children[1] } })
            );
        }

        res.status(200).json(Build);
    } catch (ex) {
        return res.status(500).json({ message: ex.toString() });
    }
});

votingRoutes.post('/voting', Only(Child), async (req, res) => {
    try {
        let ChildRepo = getRepository(Child, connection());
        let VersusRepo = getRepository(Versus, connection());
        let EmojisRepo = getRepository(Emojis, connection());

        let User = req.user as Child;

        if (User.votes > 2) {
            res.status(200).json({ msg: "Vote didn't count, but it worked!" });
            return;
        }

        let childID = req.body.childID as number;
        let matchupID = req.body.matchupID as number;
        let Emoji = req.body.emojiObj as any;

        if (!childID || !matchupID || !Emoji) {
            res.status(300).json({ msg: 'Invalid match paramaters' });
            return;
        }

        //Verify the given child is in the given matchup
        let VersusMatchup = await VersusRepo.findOne(matchupID);

        if (
            !VersusMatchup ||
            (VersusMatchup.children[0].id !== childID && VersusMatchup.children[1].id !== childID)
        ) {
            res.status(300).json({ msg: 'Given match data is invalid..' });
            return;
        }

        let targetChild = null as Child,
            opposingChild = null as Child;

        if (VersusMatchup.children[0].id === childID) {
            targetChild = VersusMatchup.children[0];
            opposingChild = VersusMatchup.children[1];
        } else {
            targetChild = VersusMatchup.children[1];
            opposingChild = VersusMatchup.children[0];
        }

        if (!targetChild || !opposingChild) {
            throw 'Invalid children in match...';
        }

        //Update the voters votes
        User.votes++;
        if (User.votes === 3) {
            User.progress.randomReview = true;
        }
        await ChildRepo.save(User);

        //Update the versus matches votes
        VersusMatchup.votes++;
        await VersusRepo.save(VersusMatchup);

        //Validate emojis
        if (!validEmojiArray(Emoji[targetChild.id]) || !validEmojiArray(Emoji[opposingChild.id])) {
            throw 'Invalid emoji array';
        }

        if (VersusMatchup.story) {
            //We need to add 1 vote to the childs tied story
            let StoryRepo = getRepository(Stories, connection());
            let Story = await StoryRepo.findOne({ child: targetChild });
            Story.votes++;
            await StoryRepo.save(Story);

            await EmojisRepo.save(new Emojis(Story, null, Emoji[targetChild.id]));

            await EmojisRepo.save(
                new Emojis(
                    await StoryRepo.findOne({ child: opposingChild }),
                    null,
                    Emoji[targetChild.id]
                )
            );
        } else {
            //We need to add 1 vote to the childs tied illustration
            let IllustrationRepo = getRepository(Illustrations, connection());
            let Illustration = await IllustrationRepo.findOne({ child: targetChild });
            Illustration.votes++;
            await IllustrationRepo.save(Illustration);

            await EmojisRepo.save(new Emojis(null, Illustration, Emoji[targetChild.id]));

            await EmojisRepo.save(
                new Emojis(
                    null,
                    await IllustrationRepo.findOne({ child: opposingChild }),
                    Emoji[targetChild.id]
                )
            );
        }

        res.status(200).json({ msg: 'Good.' });
    } catch (ex) {
        res.status(500).json({ msg: ex.toString() });
    }
});

export { votingRoutes };
