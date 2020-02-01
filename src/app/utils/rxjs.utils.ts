import { Transcription } from '@models';

export const attemptJSONParse = (data: string) => {
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onlyTranscription = (data: any): data is Transcription => data?.images && data.metadata;
