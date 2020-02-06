import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { StripeModule } from './stripe/stripe.module';
import { ScriptModule } from './script';

@Module({
  imports: [PrismaModule, StripeModule, ScriptModule],
  exports: [PrismaModule, StripeModule, ScriptModule],
})
export class SharedModule {}
