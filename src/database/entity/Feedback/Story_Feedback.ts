import { Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Child } from '../User/Child';
import { Story_Submission } from '../Submission/Story_Submission';

class Story_Feedback {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    feedback: string;

    //child ref - 3.4.20
    //child giving the feedback
    @OneToMany(
        () => Child,
        (child) => child.story_feedback
    )
    child: Child[];

    //story_submissions ref - 3.4.20
    @ManyToOne(
        () => Story_Submission,
        (story_submission) => story_submission.story_feedback
    )
    story_submission: Story_Submission[];
}

export { Story_Feedback };
