import { runScript } from '../../util/scripts/scripting';
import { Transcribable, Readable } from '../../models/internal/DS';
import { attemptJSONParse, onlyTranscription } from '../../util/utils';

export function transcribe(data: Transcribable) {
    return runScript('./src/util/scripts/transcription.py', data, (out: string[]) =>
        out.map(attemptJSONParse).find(onlyTranscription)
    );
}

export function readable(story: Readable) {
    return runScript('./src/util/scripts/readability.py', story, (out: any) =>
        out.map(attemptJSONParse)
    );
}
