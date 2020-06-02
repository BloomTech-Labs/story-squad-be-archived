import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Stories } from './Stories';
import { Illustrations } from './Illustrations';

@Entity()
class Emojis {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Stories, (story) => story.emojis, { nullable: true })
    story: Stories;

    @ManyToOne((type) => Illustrations, (illustration) => illustration.emojis, { nullable: true })
    illustration: Illustrations;

    @Column()
    emoji: String;

    constructor(story: Stories, illustration: Illustrations, emoji: String) {
        this.story = story;
        this.illustration = illustration;
        this.emoji = emoji;
    }
}

export { Emojis };
