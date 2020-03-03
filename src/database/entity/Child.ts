import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

import { Preferences } from './Preferences';
import { Progress } from './Progress';
import { Parent } from './Parent';
import { Cohort } from './Story/Cohort';
import { Submissions } from './Submission/Submissions';

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

    @OneToMany(
        (type) => Submissions,
        (submissions) => submissions.child
    )
    submissions: Submissions[];
}

export { Child };
