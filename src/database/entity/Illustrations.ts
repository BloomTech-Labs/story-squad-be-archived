import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

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

    @OneToMany((type) => Emojis, (emoji) => emoji.illustration)
    emojis: Emojis[];
}

export { Illustrations };
