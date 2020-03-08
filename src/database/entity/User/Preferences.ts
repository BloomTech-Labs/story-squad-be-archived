import { Column } from 'typeorm';

class Preferences {
    @Column({ default: false })
    dyslexia: boolean;
}

export { Preferences };
