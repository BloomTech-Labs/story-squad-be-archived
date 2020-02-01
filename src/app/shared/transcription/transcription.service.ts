import { Injectable } from '@nestjs/common';
import { PythonShell } from 'python-shell';
import { Observable } from 'rxjs';
import { map, filter, shareReplay } from 'rxjs/operators';

import { Transcribable } from '@models';
import { attemptJSONParse, onlyTranscription } from '@utils';

@Injectable()
export class TranscriptionService {
  private script = './data-science/transcription.py';

  /**
   * @description Transcribes images using the Data Science models
   * @param {Transcribable} data data URI images in the Transcribable structure
   * @returns data stream of the processed data
   * @memberof TranscriptionService
   */
  public process(data: Transcribable) {
    const { stdin, stdout, stderr } = new PythonShell(this.script, { stdio: 'pipe' });
    stdin.write(JSON.stringify(data));
    stdin.end();
    const $out = new Observable((observer) => {
      stdout.on('data', (...data) => observer.next(...data));
      stderr.on('error', (...err) => observer.error(err));
      stdout.on('close', () => observer.complete());
    });

    return $out.pipe(map(attemptJSONParse), filter(onlyTranscription), shareReplay(1));
  }
}
