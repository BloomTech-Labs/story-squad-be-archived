import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
//entities
import { Child } from '../User/Child';
// import { DueDates } from '../DueDates';
import { Round } from './Round';

// 3.2.20 individual chapter being used by cohort needs to be reflected in a relationship, not sure how
@Entity()
class Cohort {
    //key
    @PrimaryGeneratedColumn()
    id: number;

    //field
    @Column()
    name: string;

    @Column()
    week: number;

    @Column()
    activity: string;

    // @Column((type) => DueDates)
    // dueDates: DueDates;

    //relation
    @OneToMany(
        (type) => Child,
        (child) => child.cohort
    )
    children: Child[];

    @OneToMany(
        () => Round,
        (round) => round.canon
    )
    round: Round[];
}

export { Cohort };
