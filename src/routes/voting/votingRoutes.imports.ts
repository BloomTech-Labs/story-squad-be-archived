import { Stories } from '../../database/entity';
import { Transcribed_Pages } from '../../database/entity/Pages';

export class illustrationReturn {
    childId: number;
    illustration: string;

    constructor() {
        this.childId = null;
        this.illustration = null;
    }
}

export class storyReturn {
    id: number;
    childId: number;
    doc_length: number;
    story: Stories;
    transcribed_text: Transcribed_Pages;
    isFlagged: boolean;
    possibleWords: string;

    constructor() {
        this.id = null;
        this.childId = null;
        this.doc_length = null;
        this.story = null;
        this.transcribed_text = null;
        this.isFlagged = null;
        this.possibleWords = null;
    }
}

export const emojiSelection = [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '😂',
    '🙂',
    '🙃',
    '😉',
    '😇',
    '😋',
    '😜',
    '😝',
    '😐',
    '😑',
    '😶',
    '😏',
    '😒',
    '🙄',
    '😬',
    '😞',
    '😪',
    '😴',
    '😷',
    '😎',
    '😕',
    '😟',
    '🙁',
    '😮',
    '😯',
    '😲',
    '😳',
    '😦',
    '😧',
    '😰',
    '😥',
    '😢',
    '😭',
    '😱',
    '😖',
    '😣',
    '😩',
    '😫',
    '😤',
];
