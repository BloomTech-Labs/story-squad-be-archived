import { Column, PrimaryGeneratedColumn } from 'typeorm';

class Story_Feedback {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    feedback: string;
}

export { Story_Feedback };
