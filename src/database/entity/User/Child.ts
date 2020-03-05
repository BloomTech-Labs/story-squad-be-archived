import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

import { Preferences } from './Preferences';
// import { Progress } from '../Deprecated/Progress';
import { Parent } from './Parent';
import { Cohort } from '../Story/Cohort';
import { Submission } from '../Submission/Submission';
import { Child_Votes } from '../Feedback/Child_Votes';
import { Feedback } from '../Feedback/Feedback';
import { Matches } from '../Matching/Matches';

@Entity()
class Child {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    username: string;

    @Column({ nullable: false })
    grade: number;

    @Column({ default: false })
    subscription: boolean;

    @Column(() => Preferences)
    preferences: Preferences;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    pin: string;

    @Column({ nullable: true })
    total_points: number;

    @Column({ nullable: true })
    total_wins: number;

    @Column({ nullable: true })
    total_games_played: number;

    @ManyToOne(
        () => Parent,
        (parent) => parent.children
    )
    parent: Parent;

    @ManyToOne(
        () => Cohort,
        (cohort) => cohort.children
    )
    cohort: Cohort;

    @OneToMany(
        () => Submission,
        (submissions) => submissions.child
    )
    submissions: Submission[];

    //ref votes. 3-4-20
    @ManyToOne(
        () => Child_Votes,
        (child_votes) => child_votes.child
    )
    child_votes: Child_Votes[];

    //story_feedback - 3.4.20
    @OneToMany(
        () => Feedback,
        (feedback) => feedback.child
    )
    feedback: Feedback[];
}

export { Child };
