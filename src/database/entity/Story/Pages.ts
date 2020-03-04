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

export { Pages };
