// added 3.2.20 in order to nest into Child entity
// Points will include total_points, total_wins, total_games_played
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
class Points {
    @Column()
    total_points: number;

    @Column()
    total_wins: number;

    @Column()
    total_games_played: number;
}

export { Points };
