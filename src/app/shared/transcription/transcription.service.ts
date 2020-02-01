import { Injectable } from '@nestjs/common';
import { PythonShell } from 'python-shell';
import { Observable, from } from 'rxjs';
import { map, filter, shareReplay } from 'rxjs/operators';

import { Transcribable } from '@models';
import { attemptJSONParse, onlyTranscription } from '@utils';

@Injectable()
export class TranscriptionService {
  private script = './data-science/transcription.py';

  public process(data: Transcribable) {
    const args = [JSON.stringify(data)];
    const shell = new PythonShell(this.script, { args });
    const $out = new Observable((observer) => {
      shell.stdout.on('data', (...data) => observer.next(...data));
      shell.stderr.on('error', (...err) => observer.error(err));
      shell.stdout.on('close', () => observer.complete());
    });

    return $out.pipe(map(attemptJSONParse), filter(onlyTranscription), shareReplay(1));
  }
}
