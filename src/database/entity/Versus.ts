import { Child } from './Child';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Cohort } from './Cohort';

@Entity()
class Versus {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Cohort, (cohort) => cohort.versusMatches)
    cohort: Cohort;

    @ManyToOne((type) => Child, (child) => child.versusMatches)
    child1: Child;

    @ManyToOne((type) => Child, (child) => child.versusMatches)
    child2: Child;

    @Column()
    votes: number;

    constructor(cohort: Cohort, child1: Child, child2: Child, votes: number) {
        this.id = 0;
        this.cohort = cohort;
        this.child1 = child1;
        this.child2 = child2;
        this.votes = votes;
    }
}

export { Versus };
