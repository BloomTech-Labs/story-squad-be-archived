import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

import { Preferences } from './Preferences';
import { Progress } from './Progress';
import { Parent } from './Parent';
import { Cohort } from './Story/Cohort';
import { Submissions } from './Submission/Submissions';
// import nested entity Points 3.2.20
import { Points } from './Points';

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

    // nested Points with total_points/total_wins/total_games_played
    // @Column((type) => Points)
    // points: Points;

    @Column()
    avatar: string;

    @Column()
    pin: string;

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

    @OneToMany(
        (type) => Submissions,
        (submissions) => submissions.child
    )
    submissions: Submissions[];
}

export { Child };
