import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';

import { Child } from './Child';
import { DueDates } from './DueDates';
import { Versus } from './Versus';

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

    @OneToMany((type) => Child, (child) => child.cohort)
    children: Child[];

    @OneToMany((type) => Versus, (versus) => versus.cohort)
    versusMatches: Versus[];
}

export { Cohort };
