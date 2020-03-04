import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Story } from './Story';
import { Cohort_Canon } from './Cohort_Canon';
// change name to Chapter before migrating
@Entity()
class Canon {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    base64: string;

    @Column({ nullable: true })
    altbase64: string;

    // title field - 3.2.20
    @Column({ nullable: true })
    title: string;

    //junction ref - 3.4.20
    @OneToMany(
        () => Cohort_Canon,
        (cohort_canon) => cohort_canon.canon
    )
    @JoinColumn({ name: 'id' })
    cohort_canon: Cohort_Canon;
    //story ref - 3.4.20

    @ManyToOne(
        () => Story,
        (story) => story.canon
    )
    story: Story;
}

export { Canon };
