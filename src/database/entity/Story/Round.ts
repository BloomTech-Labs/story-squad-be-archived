import {
    PrimaryGeneratedColumn,
    PrimaryColumn,
    Entity,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Column,
} from 'typeorm';

import { Canon } from './Canon';
import { Cohort } from './Cohort';
import { Submission } from '../Submission/Submission';
import { Child_Votes } from '../Feedback/Child_Votes';
import { Matches } from '../Matching/Matches';

@Entity()
class Round {
    //key
    @PrimaryGeneratedColumn()
    id: number;

    //fields
    @Column()
    current: boolean;

    //reference
    @PrimaryColumn()
    canonId: number;

    @PrimaryColumn()
    cohortId: number;

    @ManyToOne(
        () => Canon,
        (canon) => canon.round,
        { primary: true }
    )
    @JoinColumn({ name: 'canonId' })
    canon: Canon[];

    @ManyToOne(
        () => Cohort,
        (cohort) => cohort.round,
        { primary: true }
    )
    @JoinColumn({ name: 'cohortId' })
    cohort: Cohort[];

    //relation

    @OneToMany(
        () => Submission,
        (submission) => submission.round
    )
    submission: Submission[];

    //child_votes ref - 3.4.20
    @OneToMany(
        () => Child_Votes,
        (child_votes) => child_votes.round
    )
    child_votes: Child_Votes[];

    //matches
    @OneToMany(
        () => Matches,
        (matches) => matches.round
    )
    matches: Matches[];
}

export { Round };
