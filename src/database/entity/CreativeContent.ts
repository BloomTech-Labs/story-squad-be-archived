import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Child } from './Child';

@Entity()
class CreativeContent {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        (type) => Child,
        (child) => child.creativeContent
    )
    child: Child;

    @Column({ nullable: false })
    week: number;

    @Column({ nullable: true })
    story: string;

    @Column({ nullable: true })
    storyText: string;

    @Column({ nullable: true })
    illustration: string;
}

export { CreativeContent };
