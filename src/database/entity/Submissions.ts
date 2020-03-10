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
    @Column()
    flesch_reading_ease: number;
    @Column()
    smog_index: number;
    @Column()
    flesch_kincaid_grade: number;
    @Column()
    coleman_liau_index: number;
    @Column()
    automated_readability_index: number;
    @Column()
    dale_chall_readability_score: number;
    @Column()
    difficult_words: number;
    @Column()
    linsear_write_formula: number;
    @Column()
    gunning_fog: number;
    @Column()
    consolidated_score: number;
    @Column()
    doc_length: number;
    @Column()
    quote_count: number;
    @Column()
    transcribed_text: number;
}

export { Submissions };
