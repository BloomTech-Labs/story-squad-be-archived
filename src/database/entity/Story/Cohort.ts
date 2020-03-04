import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';

import { Child } from '../User/Child';
import { DueDates } from '../DueDates';
import { Cohort_Canon } from './Cohort_Canon';

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

    @OneToMany(
        () => Cohort_Canon,
        (cohort_canon) => cohort_canon.canon
    )
    @JoinColumn({ name: 'id' })
    cohort_canon: number;
}

export { Cohort };
