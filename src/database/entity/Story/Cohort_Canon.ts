import {
    PrimaryGeneratedColumn,
    PrimaryColumn,
    Entity,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';

import { Canon } from './Canon';
import { Cohort } from './Cohort';
import { Story_Submission } from '../Submission/Story_Submission';
import { Drawing_Submission } from '../Submission/Drawing_Submission';

@Entity()
class Cohort_Canon {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn()
    canonId: number;

    @PrimaryColumn()
    cohortId: number;

    @ManyToOne(
        () => Canon,
        (canon) => canon.cohortConnection,
        { primary: true }
    )
    @JoinColumn({ name: 'canonId' })
    canon: number;

    @ManyToOne(
        () => Cohort,
        (cohort) => cohort.cohortConnection,
        { primary: true }
    )
    @JoinColumn({ name: 'cohortId' })
    cohort: number;

    @OneToMany(
        () => Story_Submission,
        (story_submission) => story_submission.cohort_canon
    )
    story_submission: number;

    @OneToMany(
        () => Drawing_Submission,
        (drawing_submission) => drawing_submission.cohort_chapters_id
    )
    drawing_submission: number;
}

export { Cohort_Canon };
