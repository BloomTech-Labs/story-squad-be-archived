import { Cohort, Canon } from '../entity';
import { DueDates } from '../entity/DueDates';

let c1 = new Cohort();
c1.name = 'Main';
c1.week = 1;
c1.activity = 'reading';
c1.dueDates = new DueDates();
c1.dueDates.reading = new Date();
c1.dueDates.writing = new Date();
c1.dueDates.drawing = new Date();

export const CohortSeed = [c1];

let CanonStory = new Canon();
CanonStory.week = 1;
CanonStory.base64 = '--';

export const CanonSeed = [CanonStory];
