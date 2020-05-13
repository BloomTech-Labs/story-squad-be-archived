import { Entity, OneToMany, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Stories } from './Stories';
import { Illustrations } from './Illustrations';

@Entity()
class Emojis {
    @OneToMany((type) => Stories, (story) => story.emojis, { nullable: true })
    @PrimaryGeneratedColumn()
    story: Stories;

    @OneToMany((type) => Illustrations, (illustration) => illustration.emojis, { nullable: true })
    @PrimaryGeneratedColumn()
    illustration: Illustrations;

    @Column()
    emoji: String;

    constructor(story: Stories, illustrations: Illustrations, emoji: String) {
        this.story = story;
        this.illustration = illustrations;
        this.emoji = emoji;
    }
}

export { Emojis };
