// Story entity for sake of persisting chapters within larger story entity for re-use
// Not in a rush to implement this
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Canon } from './Canon';

@Entity()
class Story {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    base64: string;

    @Column({ nullable: true })
    altbase64: string;

    @Column({ nullable: true })
    title: string;

    // needs a one to many with canon/chapters
}

export { Story };
