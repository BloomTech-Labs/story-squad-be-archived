import { Stories, Illustrations } from '../../database/entity';
import { Transcribable } from '../../models';
import { Emojis } from '../../database/entity/Emojis';

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
    emojis: Emojis;

    constructor() {
        this.id = null;
        this.childId = null;
        this.username = null;
        this.points = null;
        this.doc_length = null;
        this.story = null;
        this.transcribed_text = null;
        this.emojis = null;
    }
}

export class IllustrationSend {
    id: Number;
    childId: Number;
    illustration: Illustrations;
    points: Number;
    emojis: Emojis;

    constructor() {
        this.id = null;
        this.childId = null;
        this.points = null;
        this.illustration = null;
        this.emojis = null;
    }
}

export class TeamData {
    id: Number;
    username: String;

    constructor() {
        this.id = null;
        this.username = null;
    }
}
