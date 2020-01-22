import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Preferences } from './Preferences';
import { Progress } from './Progress';
import { Parent } from './Parent';
import { Cohort } from './Cohort';

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
}

export { Child };
