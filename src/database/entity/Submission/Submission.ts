import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, OneToMany } from 'typeorm';
//entities
import { Child } from '../User/Child';
import { Feedback } from '../Feedback/Feedback';
import { Round } from '../Story/Round';
import { Readability } from './Readability';

@Entity()
class Submission {
    //key
    @PrimaryGeneratedColumn()
    id: number;

    //fields
    @Column()
    image: string;

    @Column()
    allocated_points: number;

    @Column()
    final_points: number;

    @Column()
    high_bracket: boolean;

    @Column()
    low_bracket: boolean;

    @Column()
    win: boolean;

    @Column()
    date: Date;

    @Column()
    votes: number;

    //fornow
    @Column()
    type: 'story' | 'illustration';

    //relation
    @ManyToOne(
        () => Child,
        (child) => child
    )
    child: Child;

    @OneToOne(
        () => Readability,
        (readability) => readability.submission
    )
    readability: Readability[];

    //cohort chapter - one to many
    @ManyToOne(
        () => Round,
        (round) => round.submission
    )
    round: Round[];

    //story feedback ref - 3.4.20
    @OneToMany(
        () => Feedback,
        (feedback) => feedback.submission
    )
    feedback: Feedback[];
}

export { Submission };
