import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Parent {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false })
    public username: string;

    @Column({ nullable: false })
    public password: string;
}

export { Parent };
