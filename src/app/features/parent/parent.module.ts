import { Module } from '@nestjs/common';

import { ParentController } from './parent.controller';

@Module({
  controllers: [ParentController],
})
export class ParentModule {}
