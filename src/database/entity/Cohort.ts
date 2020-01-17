import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Cohort {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false })
    public week: number;

    @Column({ nullable: false })
    public activity: string;
}

export { Cohort };
