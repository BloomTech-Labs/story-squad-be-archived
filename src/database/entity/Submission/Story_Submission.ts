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
import { Readability } from './Readability';

@Entity()
class Story_Submission {
    //key
    @PrimaryGeneratedColumn()
    id: number;

    //fields
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

    //relation
    @ManyToOne(
        () => Child,
        (child) => child
    )
    child: Child;

    @OneToOne(
        () => Readability,
        (readability) => readability.story_submission
    )
    readability: Readability[];

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
}

export { Story_Submission };
