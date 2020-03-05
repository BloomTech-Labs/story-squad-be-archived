// 3.2.20 -
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToOne } from 'typeorm';
import { Submission } from './Submission';

@Entity()
class Readability {
    @PrimaryGeneratedColumn()
    id: number;

    // needs a one to one with story_submission
    @OneToOne(
        () => Submission,
        (submission) => submission.readability
    )
    submission: Submission[];

    @Column()
    flesch_reading_ease: string;
    @Column()
    smog_index: string;
    @Column()
    flesch_kincaid_grade: string;
    @Column()
    coleman_liau_index: string;
    @Column()
    automated_readability_index: string;
    @Column()
    dale_chall_readability_score: string;
    @Column()
    difficult_words: string;
    @Column()
    linsear_write_formula: string;
    @Column()
    gunning_fog: string;
    @Column()
    consolidated_score: string;
    @Column()
    doc_length: string;
    @Column()
    quote_count: string;
    @Column()
    transcribed_text: string;
}

export { Readability };
