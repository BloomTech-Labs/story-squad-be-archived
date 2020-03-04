// Story entity for sake of persisting chapters within larger story entity for re-use
// Not in a rush to implement this
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
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

    //canon ref - 3.4.20
    @OneToMany(
        () => Canon,
        (canon) => canon.story
    )
    canon: Canon;
}

export { Story };
