import { Module } from '@nestjs/common';

import { SharedModule } from '@shared/shared.module';
import { AuthModule } from '@features/auth/auth.module';

import { ChildController } from './child.controller';
import { ChildService } from './child.service';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [ChildController],
  providers: [ChildService],
})
export class ChildModule {}
