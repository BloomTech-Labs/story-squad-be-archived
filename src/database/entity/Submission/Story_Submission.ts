import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Child } from '../User/Child';
import { Cohort_Canon } from '../Story/Cohort_Canon';
import { Story_Feedback } from '../Feedback/Story_Feedback';

@Entity()
class Story_Submission {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Child)
    @JoinColumn()
    child_id: Child;

    //cohort chapter - one to many
    @ManyToOne(
        () => Cohort_Canon,
        (cohort_canon) => cohort_canon.story_submission
    )
    cohort_canon: Cohort_Canon;

    //story feedback ref - 3.4.20
    @OneToMany(
        () => Story_Feedback,
        (story_feedback) => story_feedback.story_submission
    )
    story_feedback: Story_Feedback[];

    @Column()
    cohort_chapters_id: number;

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
}

export { Story_Submission };
