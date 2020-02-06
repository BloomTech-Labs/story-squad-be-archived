import { Transcribable, Transcription } from '@models';

export interface Scripts {
  './data-science/transcription.py': {
    input: Transcribable;
    output: Transcription;
  };
}
