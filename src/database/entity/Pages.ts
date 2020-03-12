import { Column } from 'typeorm';

class Pages {
    @Column({ nullable: true })
    page1: string;
    // content is a Data URI of an image: https://en.wikipedia.org/wiki/Data_URI_scheme

    @Column({ nullable: true })
    page2: string;

    @Column({ nullable: true })
    page3: string;

    @Column({ nullable: true })
    page4: string;

    @Column({ nullable: true })
    page5: string;
}

class Transcribed_Pages {
    @Column({ nullable: true })
    t_page1: string;

    @Column({ nullable: true })
    t_page2: string;

    @Column({ nullable: true })
    t_page3: string;

    @Column({ nullable: true })
    t_page4: string;

    @Column({ nullable: true })
    t_page5: string;
}

export { Pages, Transcribed_Pages };
