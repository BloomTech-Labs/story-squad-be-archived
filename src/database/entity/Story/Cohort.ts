import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Child } from '../Child';
import { DueDates } from '../DueDates';

// 3.2.20 individual chapter being used by cohort needs to be reflected in a relationship, not sure how

@Entity()
class Cohort {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    week: number;

    @Column()
    activity: string;

    @Column((type) => DueDates)
    dueDates: DueDates;

    @OneToMany(
        (type) => Child,
        (child) => child.cohort
    )
    children: Child[];
}

export { Cohort };
