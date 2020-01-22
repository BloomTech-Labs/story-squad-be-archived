import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
class Canon {
    @PrimaryColumn({ nullable: false, unique: true })
    public week: number;

    @Column({ nullable: false })
    public base64: string;

    @Column({ nullable: true })
    public altbase64: string;
}

export { Canon };
