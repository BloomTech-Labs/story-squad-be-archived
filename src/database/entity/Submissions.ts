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

export { Submissions };
