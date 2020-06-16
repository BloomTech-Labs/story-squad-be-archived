import { Child } from './Child';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Cohort } from './Cohort';
import { Matches } from './Matches';

@Entity()
class Versus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cohortId: number;
    @ManyToOne((type) => Cohort, (cohort) => cohort.versusMatches)
    cohort: Cohort;

    @ManyToOne((type) => Matches, (match) => match.versusMatches)
    match: Matches;

    @ManyToMany((type) => Child, (child) => child.versusMatches, { eager: true })
    @JoinTable()
    children: Child[];

    @Column()
    votes: number;

    @Column()
    story: boolean;

    constructor(cohort: Cohort, children: Child[], votes: number, story: boolean, match: Matches) {
        this.id = 0;
        this.cohort = cohort;
        this.children = children;
        this.votes = votes;
        this.story = story;
        this.match = match;
    }
}

export { Versus };
