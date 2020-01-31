import { Module } from '@nestjs/common';

import { SharedModule } from '@shared/shared.module';

import {
  AdminModule,
  AuthModule,
  CanonModule,
  ChildModule,
  CohortModule,
  ParentModule,
  PaymentModule,
  SubmissionModule,
} from '@features';

@Module({
  imports: [
    SharedModule,
    AdminModule,
    AuthModule,
    CanonModule,
    ChildModule,
    CohortModule,
    ParentModule,
    PaymentModule,
    SubmissionModule,
  ],
})
export class AppModule {}
