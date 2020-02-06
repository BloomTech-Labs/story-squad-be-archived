import { Progress, Cohort } from '@prisma/client';
import { Child } from '@models';

export interface ChildDTO extends Child {
  cohort: Cohort;
  progress: Progress[];
}
