import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Cannon {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false })
    public base64: string;
}

export { Cannon };
