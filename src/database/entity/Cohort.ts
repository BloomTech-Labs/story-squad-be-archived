import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Child } from './Child';

@Entity()
class Cohort {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false })
    public week: number;

    @Column({ nullable: false })
    public activity: string;

    @OneToMany(
        (type) => Child,
        (child) => child.cohort
    )
    children: Child[];
}

export { Cohort };
