import { Column, PrimaryGeneratedColumn, ManyToOne, Entity } from 'typeorm';
//entities
import { Child } from '../User/Child';
import { Submission } from '../Submission/Submission';

@Entity()
class Feedback {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    feedback: string;

    @ManyToOne(
        () => Child,
        (child) => child.feedback
    )
    child: Child[];

    @ManyToOne(
        () => Submission,
        (submission) => submission.feedback
    )
    submission: Submission[];
}

export { Feedback };
