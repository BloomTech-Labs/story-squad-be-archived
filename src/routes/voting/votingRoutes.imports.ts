import { Stories } from '../../database/entity';
import { Transcribed_Pages } from '../../database/entity/Pages';

export class illustrationReturn {
    id: number;
    illustration: string;

    constructor() {
        this.id = null;
        this.illustration = null;
    }
}

export class storyReturn {
    id: number;
    doc_length: number;
    story: Stories;
    transcribed_text: Transcribed_Pages;

    constructor() {
        this.id = null;
        this.doc_length = null;
        this.story = null;
        this.transcribed_text = null;
    }
}
