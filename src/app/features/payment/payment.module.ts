import { Module } from '@nestjs/common';

import { SharedModule } from '@shared/shared.module';

import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [SharedModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
