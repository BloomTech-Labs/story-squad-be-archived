import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { Versus } from './Versus';

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

    @OneToMany((type) => Versus, (versus) => versus.match)
    versusMatches: Versus[];
}

export { Matches };
