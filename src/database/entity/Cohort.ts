import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Child } from './Child';
import { DueDates } from './DueDates';

@Entity()
class Cohort {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    week: number;

    @Column({ nullable: false })
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
