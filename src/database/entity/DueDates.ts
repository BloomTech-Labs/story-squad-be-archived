import { Column } from 'typeorm';

import { Activities } from '../../models';

class DueDates implements Activities {
    @Column()
    reading: Date;

    @Column()
    writing: Date;

    @Column()
    drawing: Date;

    @Column({ nullable: true })
    teamReview: Date;

    @Column({ nullable: true })
    randomReview: Date;

    @Column({ nullable: true })
    results: Date;
}

export { DueDates };
