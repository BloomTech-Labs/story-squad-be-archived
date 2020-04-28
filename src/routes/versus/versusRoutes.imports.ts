import { Stories } from '../../database/entity';
import { Transcribable } from '../../models';

export const LEFT = 0;
export const RIGHT = 1;

export class StorySend {
    id: Number;
    childId: Number;
    username: String;
    points: Number;
    doc_length: Number;
    story: Stories;
    transcribed_text: Transcribable;

    constructor() {
        this.id = null;
        this.childId = null;
        this.username = null;
        this.points = null;
        this.doc_length = null;
        this.story = null;
        this.transcribed_text = null;
    }
}
