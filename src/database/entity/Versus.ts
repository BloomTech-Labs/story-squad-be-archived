import { Child } from './Child';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany } from 'typeorm';
import { Cohort } from './Cohort';

@Entity()
class Versus {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Cohort, (cohort) => cohort.versusMatches)
    cohort: Cohort;

    @ManyToMany((type) => Child, (child) => child.versusMatches)
    children: Child[];

    @Column()
    votes: number;

    constructor(cohort: Cohort, children: Child[], votes: number) {
        this.id = 0;
        this.cohort = cohort;
        this.children = children;
        this.votes = votes;
    }
}

export { Versus };
