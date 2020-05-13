import { Entity, OneToMany, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Stories } from './Stories';
import { Illustrations } from './Illustrations';

@Entity()
class Emojis {
    @OneToMany((type) => Stories, (story) => story.emojis, { nullable: true })
    @PrimaryGeneratedColumn()
    story: Stories;

    @OneToMany((type) => Illustrations, (illustration) => illustration.emojis, { nullable: true })
    illustrations: Stories;

    @Column()
    emoji: String;
}

export { Emojis };
