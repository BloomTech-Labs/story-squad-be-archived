import { Module } from '@nestjs/common';

import { SharedModule } from '@shared/shared.module';
import { AuthModule } from '@features/auth/auth.module';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
