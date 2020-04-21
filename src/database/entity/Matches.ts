import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
class Matches {
    //key
    @PrimaryGeneratedColumn()
    id: number;

    //fields
    @Column({ nullable: true })
    team1_child1_id: number;

    @Column({ nullable: true })
    team1_child2_id: number;

    @Column({ nullable: true })
    team2_child1_id: number;

    @Column({ nullable: true })
    team2_child2_id: number;

    @Column({ nullable: true })
    week: number;
}

export { Matches };
