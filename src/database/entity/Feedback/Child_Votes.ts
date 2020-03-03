import { Column, PrimaryGeneratedColumn } from 'typeorm';

class Child_Votes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    votes: number;
}

export { Child_Votes };
