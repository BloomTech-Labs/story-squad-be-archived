import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Parent {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false, unique: true })
    public email: string;

    @Column({ nullable: false })
    public password: string;

    @Column({ nullable: false })
    public email: string;

    @Column({ nullable: true })
    public stripe: jsonb;
}

export { Parent };
