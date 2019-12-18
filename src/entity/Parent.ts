import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Parent {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public username: string;

    @Column()
    public password: string;
}

export { Parent };
