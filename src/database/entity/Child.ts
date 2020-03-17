import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

import { Preferences } from './Preferences';
import { Progress } from './Progress';
import { Parent } from './Parent';
import { Cohort } from './Cohort';
import { Submissions } from './Submissions';

@Entity()
class Child {
    @PrimaryGeneratedColumn()
    id: number;
    //making a change so github notices me
    @Column()
    username: string;

    @Column()
    grade: number;

    @Column({ default: false })
    subscription: boolean;

    @Column({ nullable: true })
    avatar: string;

    @Column((type) => Preferences)
    preferences: Preferences;

    @Column((type) => Progress)
    progress: Progress;

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
// what about now
