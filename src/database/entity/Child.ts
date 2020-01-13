import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Parent } from './Parent';
import { Preferences } from './Preferences';

@Entity()
class Child {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        (type) => Parent,
        (parent) => parent.children
    )
    parent: Parent;

    @Column()
    username: string;

    @Column()
    week: number;

    @Column()
    grade: number;

    @Column((type) => Preferences)
    preferences: Preferences;
}

export { Child };
