import { Column } from 'typeorm';

import { Activities } from '../../models';

class Progress {
    @Column({ default: false })
    reading: boolean;

    @Column({ default: false })
    writing: boolean;

    @Column({ default: false })
    drawing: boolean;

    @Column({ default: false })
    teamReview: boolean;

    @Column({ default: false })
    randomReview: boolean;

    // @Column({ default: false })
    // results: boolean;
}

export { Progress };
