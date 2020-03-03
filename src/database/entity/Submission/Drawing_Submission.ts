import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm'
import { Child } from '../Child';

@Entity()
class DrawingSubmissions {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=> Child)
    @JoinColumn()
    child_id: Child;

    //cohort chapter - one to many

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