import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Parent } from './Parent';
import { Preferences } from './Preferences';
import { Cohort } from './Cohort';

@Entity()
class Child {
    @PrimaryGeneratedColumn()
    id: number;

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

    @Column()
    username: string;

    @Column()
    grade: number;

    @Column((type) => Preferences)
    preferences: Preferences;

    @Column({ default: false })
    subscription: boolean;
}

export { Child };
