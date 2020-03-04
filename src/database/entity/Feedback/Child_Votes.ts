import { Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Child } from '../User/Child';
import { Matches } from '../Matching/Matches';
import { Cohort_Canon } from '../Story/Cohort_Canon';

class Child_Votes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    votes: number;

    //child ref - 3.4.20
    @ManyToOne(
        () => Child,
        (child) => child.child_votes
    )
    child: Child[];

    //match ref - 3.4.20
    @ManyToOne(
        () => Matches,
        (matches) => matches.child_votes
    )
    matches: Matches[];

    //cohorts_chapters ref - 3.4.20
    @ManyToOne(
        () => Cohort_Canon,
        (cohort_canon) => cohort_canon.child_votes
    )
    cohort_canon: Cohort_Canon[];
}

export { Child_Votes };
