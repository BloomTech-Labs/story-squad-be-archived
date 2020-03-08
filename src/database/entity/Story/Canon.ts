import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
//entities
import { Story } from './Story';
import { Round } from './Round';
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
        () => Round,
        (round) => round.canon
    )
    @JoinColumn({ name: 'id' })
    round: Round;
    //story ref - 3.4.20

    @ManyToOne(
        () => Story,
        (story) => story.canon
    )
    story: Story;
}

export { Canon };
