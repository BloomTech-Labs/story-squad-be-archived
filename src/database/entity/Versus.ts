import { Child } from './Child';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Cohort } from './Cohort';

@Entity()
class Versus {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Cohort, (cohort) => cohort.versusMatches)
    cohort: Cohort;

    @ManyToMany((type) => Child, (child) => child.versusMatches)
    @JoinTable()
    children: Child[];

    @Column()
    votes: number;

    @Column()
    story: boolean;

    constructor(cohort: Cohort, children: Child[], votes: number, story: boolean) {
        this.id = 0;
        this.cohort = cohort;
        this.children = children;
        this.votes = votes;
        this.story = story;
    }
}

export { Versus };
