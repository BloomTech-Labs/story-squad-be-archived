import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Child } from '../Child';
import { Cohort_Canon } from '../Story/Cohort_Canon';
@Entity()
class Drawing_Submission {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Child)
    @JoinColumn()
    child_id: Child;

    //cohort chapter - one to many
    @ManyToOne(
        () => Cohort_Canon,
        (cohort_canon) => cohort_canon.id
    )
    @Column()
    cohort_chapters_id: number;

    @Column()
    image: string;

    @Column()
    allocated_points: number;

    @Column()
    final_points: number;

    @Column()
    high_bracket: boolean;

    @Column()
    low_bracket: boolean;

    @Column()
    win: boolean;

    @Column()
    date: Date;

    @Column()
    votes: number;
}

export { Drawing_Submission };
