import { Column, PrimaryGeneratedColumn } from 'typeorm';

class Matches {
    @PrimaryGeneratedColumn()
    id: number;
}

export { Matches };
