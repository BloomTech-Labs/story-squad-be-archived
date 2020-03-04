import { Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Child } from '../User/Child';
import { Drawing_Submission } from '../Submission/Drawing_Submission';

class Drawing_Feedback {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    feedback: string;

    @ManyToOne(
        () => Child,
        (child) => child.drawing_feedback
    )
    child: Child[];

    @ManyToOne(
        () => Drawing_Submission,
        (drawing_submission) => drawing_submission.drawing_feedback
    )
    drawing_submission: Drawing_Submission[];
}

export { Drawing_Feedback };
