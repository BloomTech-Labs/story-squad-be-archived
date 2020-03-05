import { Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, Entity } from 'typeorm';
import { Child_Votes } from '../Feedback/Child_Votes';
import { Round } from '../Story/Round';
@Entity()
class Matches {
    //key
    @PrimaryGeneratedColumn()
    id: number;

    //fields
    @Column()
    team1_child1_id: number;

    @Column()
    team1_child2_id: number;

    @Column()
    team2_child1_id: number;

    @Column()
    team2_child2_id: number;

    //relations
    //child_votes ref - 3.4.20
    @OneToMany(
        () => Child_Votes,
        (child_votes) => child_votes.matches
    )
    child_votes: Child_Votes[];

    //Cohort_Canon ref - 3.4.20
    @ManyToOne(
        () => Round,
        (round) => round.matches
    )
    round: Round[];
}

export { Matches };
