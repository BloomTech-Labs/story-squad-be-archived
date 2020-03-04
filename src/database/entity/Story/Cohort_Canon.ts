import {
    PrimaryGeneratedColumn,
    PrimaryColumn,
    Entity,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Column,
} from 'typeorm';

import { Canon } from './Canon';
import { Cohort } from './Cohort';
import { Story_Submission } from '../Submission/Story_Submission';
import { Drawing_Submission } from '../Submission/Drawing_Submission';
import { Child_Votes } from '../Feedback/Child_Votes';
import { Matches } from '../Matching/Matches';

@Entity()
class Cohort_Canon {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn()
    canonId: number;

    @PrimaryColumn()
    cohortId: number;

    @Column()
    current: boolean;

    @ManyToOne(
        () => Canon,
        (canon) => canon.cohort_canon,
        { primary: true }
    )
    @JoinColumn({ name: 'canonId' })
    canon: Canon;

    @ManyToOne(
        () => Cohort,
        (cohort) => cohort.cohort_canon,
        { primary: true }
    )
    @JoinColumn({ name: 'cohortId' })
    cohort: Cohort;

    @OneToMany(
        () => Story_Submission,
        (story_submission) => story_submission.cohort_canon
    )
    story_submission: Story_Submission;

    @OneToMany(
        () => Drawing_Submission,
        (drawing_submission) => drawing_submission.cohort_chapters_id
    )
    drawing_submission: Drawing_Submission;

    //child_votes ref - 3.4.20
    @OneToMany(
        () => Child_Votes,
        (child_votes) => child_votes.cohort_canon
    )
    child_votes: Child_Votes[];

    //matches
    @OneToMany(
        () => Matches,
        (matches) => matches.cohort_canon
    )
    matches: Matches[];
}

export { Cohort_Canon };
