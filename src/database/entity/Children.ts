import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Children {
    @PrimaryGeneratedColumn()
    id: number;

    // @ManyToOne(type => Parent, parent => parent.children )
    // parent: Parent

    @Column()
    username: string;

    @Column()
    week: number;

    @Column()
    grade: number;
}
