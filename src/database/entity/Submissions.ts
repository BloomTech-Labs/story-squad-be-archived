import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Child } from './Child';
import { Pages } from './Pages';

@Entity()
class Submissions {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        (type) => Child,
        (child) => child.submissions,
        { onDelete: 'CASCADE' }
    )
    child: Child;

    @Column({ nullable: false })
    week: number;

    @Column((type) => Pages)
    story: Pages;

    @Column({ nullable: true })
    storyText: string;

    @Column({ nullable: true })
    illustration: string;

    // readability
    // we will need to make a separate table and link it with individual pages
    // for now just pass in one page's readability
    // 3.9.20
    @Column({ type: 'double precision', nullable: true })
    flesch_reading_ease: number;
    @Column({ nullable: true })
    smog_index: number;
    @Column({ type: 'double precision', nullable: true })
    flesch_kincaid_grade: number;
    @Column({ type: 'double precision', nullable: true })
    coleman_liau_index: number;
    @Column({ nullable: true })
    automated_readability_index: number;
    @Column({ type: 'double precision', nullable: true })
    dale_chall_readability_score: number;
    @Column({ nullable: true })
    difficult_words: number;
    @Column({ nullable: true })
    linsear_write_formula: number;
    @Column({ type: 'double precision', nullable: true })
    gunning_fog: number;
    @Column({ nullable: true })
    consolidated_score: string;
    @Column({ nullable: true })
    doc_length: number;
    @Column({ nullable: true })
    quote_count: number;
    @Column((type) => Pages)
    transcribed_text: Pages;
}

export { Submissions };
