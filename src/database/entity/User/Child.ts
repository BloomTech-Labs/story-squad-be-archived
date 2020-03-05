import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

import { Preferences } from './Preferences';
import { Progress } from '../Progress';
import { Parent } from './Parent';
import { Cohort } from '../Story/Cohort';
import { Submissions } from '../Submission/Submissions';
import { Story_Submission } from '../Submission/Story_Submission';
import { Drawing_Submission } from '../Submission/Drawing_Submission';
import { Child_Votes } from '../Feedback/Child_Votes';
import { Story_Feedback } from '../Feedback/Story_Feedback';
import { Drawing_Feedback } from '../Feedback/Drawing_Feedback';
import { Matches } from '../Matching/Matches';

@Entity()
class Child {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    grade: number;

    @Column({ default: false })
    subscription: boolean;

    // accounts for dyslexia option
    // how does this work as a nested field?
    @Column((type) => Preferences)
    preferences: Preferences;

    // progress - reading / writing / submission
    // do we need this?
    @Column((type) => Progress)
    progress: Progress;

    @Column()
    avatar: string;

    @Column()
    pin: string;

    @Column()
    total_points: number;

    @Column()
    total_wins: number;

    @Column()
    total_games_played: number;

    @ManyToOne(
        (type) => Parent,
        (parent) => parent.children
    )
    parent: Parent;

    @ManyToOne(
        (type) => Cohort,
        (cohort) => cohort.children
    )
    cohort: Cohort;

    // @OneToMany(
    //     (type) => Submissions,
    //     (submissions) => submissions.child
    // )
    // submissions: Submissions[];

    @OneToMany(
        (type) => Story_Submission,
        (story_submissions) => story_submissions.child
    )
    story_submissions: Story_Submission[];

    @OneToMany(
        (type) => Drawing_Submission,
        (drawing_submission) => drawing_submission.child
    )
    drawing_submission: Drawing_Submission[];

    //ref votes. 3-4-20
    @ManyToOne(
        () => Child_Votes,
        (child_votes) => child_votes.child
    )
    child_votes: Child_Votes[];

    //story_feedback - 3.4.20
    @OneToMany(
        () => Story_Feedback,
        (story_feedback) => story_feedback.child
    )
    story_feedback: Story_Feedback[];

    //drawing_feedback - 3.4.20
    @OneToMany(
        () => Drawing_Feedback,
        (drawing_feedback) => drawing_feedback.child
    )
    drawing_feedback: Drawing_Feedback[];
}

export { Child };
