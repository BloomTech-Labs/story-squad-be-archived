import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Example {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string = '';

    @Column()
    public isComplete: boolean = false;
}

export default Example;
