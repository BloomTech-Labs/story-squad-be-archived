import { Column, PrimaryGeneratedColumn } from 'typeorm';

class Drawing_Feedback {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    feedback: string;
}

export { Drawing_Feedback };
