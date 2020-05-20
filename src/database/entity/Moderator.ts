import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Cohort } from "./Cohort";

@Entity()
class Moderator {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false })
    password: string;

    // temporary token used to change password
    @Column({ nullable: true })
    temptoken: string;

    @OneToMany((type) => Cohort, (cohort) => cohort.children)
    cohort: Cohort;

}

export { Moderator };