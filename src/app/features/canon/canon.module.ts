import { Module } from '@nestjs/common';

import { SharedModule } from '@shared/shared.module';

import { CanonController } from './canon.controller';
import { CanonService } from './canon.service';

@Module({
  imports: [SharedModule],
  controllers: [CanonController],
  providers: [CanonService],
})
export class CanonModule {}
