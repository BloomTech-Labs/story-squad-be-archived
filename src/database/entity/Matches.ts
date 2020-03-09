import { Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, Entity } from 'typeorm';

@Entity()
class Matches {
    //key
    @PrimaryGeneratedColumn()
    id: number;

    //fields
    @Column()
    team1_child1_id: number;

    @Column()
    team1_child2_id: number;

    @Column()
    team2_child1_id: number;

    @Column()
    team2_child2_id: number;
}

export { Matches };
