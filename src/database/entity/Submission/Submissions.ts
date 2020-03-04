import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Child } from '../User/Child';
import { Pages } from '../Story/Pages';

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
}

export { Submissions };
