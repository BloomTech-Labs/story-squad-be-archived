import { Column } from 'typeorm';

import { Activities } from '../../models';

class DueDates implements Activities {
    @Column()
    reading: Date;

    @Column()
    writing: Date;

    @Column()
    submission: Date;

    @Column()
    teamReview: Date;

    @Column()
    randomReview: Date;

    @Column()
    results: Date;
}

export { DueDates };
