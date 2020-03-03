import {
    Entity,
    Column,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Story } from './Story';
import { Cohort_Canon } from './Cohort_Canon';
// change name to Chapter before migrating
@Entity()
class Canon {
    // @PrimaryColumn({ nullable: false, unique: true })
    // week: number;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    base64: string;

    @Column({ nullable: true })
    altbase64: string;

    // title field - 3.2.20
    @Column({ nullable: true })
    title: string;

    @OneToMany(
        () => Cohort_Canon,
        (cohort_canon) => cohort_canon.canon
    )
    @JoinColumn({ name: 'id' })
    cohortConnection: number;
}

export { Canon };
