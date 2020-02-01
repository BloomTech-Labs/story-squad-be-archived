import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { StripeModule } from './stripe/stripe.module';
import { TranscriptionModule } from './transcription';

@Module({
  imports: [PrismaModule, StripeModule, TranscriptionModule],
  exports: [PrismaModule, StripeModule, TranscriptionModule],
})
export class SharedModule {}
