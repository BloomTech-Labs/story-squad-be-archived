import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [PrismaModule, StripeModule],
  exports: [PrismaModule, StripeModule],
})
export class SharedModule {}
