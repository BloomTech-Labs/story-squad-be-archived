import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Child } from './Child';
import { Emojis } from './Emojis';

@Entity()
class Illustrations {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    childId: number;
    @ManyToOne((type) => Child, (child) => child.illustrations, { onDelete: 'CASCADE' })
    @JoinColumn()
    child: Child;

    @Column({ nullable: false })
    week: number;

    @Column({ nullable: true })
    illustration: string;

    @Column({ nullable: true })
    points: number;

    @Column({ nullable: true })
    votes: number;

    @ManyToOne((type) => Emojis, (emoji) => emoji.story)
    emojis: Emojis;
}

export { Illustrations };
