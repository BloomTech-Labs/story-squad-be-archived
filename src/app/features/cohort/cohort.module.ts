import { Module } from '@nestjs/common';

import { SharedModule } from '@shared/shared.module';

import { CohortController } from './cohort.controller';
import { CohortService } from './cohort.service';

@Module({
  imports: [SharedModule],
  controllers: [CohortController],
  providers: [CohortService],
})
export class CohortModule {}
