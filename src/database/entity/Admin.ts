import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false })
    password: string;

    // temporary token used to change password
    @Column({ nullable: true })
    temptoken: string;

    // gives the admin ability to create/delete other admin/moderator
    @Column({ nullable: false })
    role: 'admin' | 'moderator';
}

export { Admin };
