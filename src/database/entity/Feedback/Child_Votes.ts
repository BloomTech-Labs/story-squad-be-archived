import { Column, PrimaryGeneratedColumn, ManyToOne, Entity } from 'typeorm';
//entities
import { Child } from '../User/Child';
import { Matches } from '../Matching/Matches';
import { Round } from '../Story/Round';

@Entity()
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
        () => Round,
        (round) => round.child_votes
    )
    round: Round[];
}

export { Child_Votes };
