import { Column, PrimaryGeneratedColumn } from 'typeorm';

class Pair {
    @PrimaryGeneratedColumn()
    id: number;
}

export { Pair };
