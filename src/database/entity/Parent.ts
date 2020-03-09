import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Child } from './Child';

@Entity()
class Parent {
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column({ nullable: true })
    name: string;

    @OneToMany(
        (type) => Child,
        (child) => child.parent
    )
    public children?: Child[];

    @Column({ nullable: false, unique: true })
    public email: string;

    @Column({ nullable: false })
    public password: string;

    @Column({ nullable: true })
    public stripeID: string;
}

type SecureParent = Omit<Parent, 'password'>;

export { Parent, SecureParent };
