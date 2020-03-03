import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Story } from './Story';
// change name to Chapter before migrating
@Entity()
class Canon {
    // @PrimaryColumn({ nullable: false, unique: true })
    // week: number;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    base64: string;

    @Column({ nullable: true })
    altbase64: string;

    // title field - 3.2.20
    @Column({ nullable: true })
    title: string;

    // @ManyToOne(
    //     (type) => Story,
    //     (story) => story.children
    // )
    // story: Story;
    // relation
}

export { Canon };
