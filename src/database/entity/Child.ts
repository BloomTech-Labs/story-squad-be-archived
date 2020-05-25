import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    JoinColumn,
} from 'typeorm';

import { Preferences } from './Preferences';
import { Progress } from './Progress';
import { Parent } from './Parent';
import { Cohort } from './Cohort';
import { Illustrations } from './Illustrations';
import { Stories } from './Stories';
import { Versus } from './Versus';

@Entity()
class Child {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    grade: number;

    @Column({ default: false })
    subscription: boolean;

    @Column({ nullable: true })
    avatar: string;

    @Column((type) => Preferences)
    preferences: Preferences;

    @Column((type) => Progress)
    progress: Progress;

    @Column({ nullable: true })
    total_points: number;

    @Column({ nullable: true })
    wins: number;

    @Column({ nullable: true })
    losses: number;

    @Column({ nullable: true })
    votes: number;

    @ManyToOne((type) => Parent, (parent) => parent.children)
    parent: Parent;

    @ManyToOne((type) => Cohort, (cohort) => cohort.children)
    cohort: Cohort;

    @OneToMany((type) => Illustrations, (illustrations) => illustrations.child)
    illustrations: Illustrations[];

    @OneToMany((type) => Stories, (stories) => stories.child)
    stories: Stories[];

    @ManyToMany((type) => Versus, (versus) => versus.children)
    versusMatches: Versus[];
}

export { Child };
