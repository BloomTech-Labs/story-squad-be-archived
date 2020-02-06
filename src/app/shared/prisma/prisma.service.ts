import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnApplicationShutdown {
  constructor() {
    super({
      debug: false,
    });
  }
  public onApplicationShutdown() {
    this.disconnect();
  }
}
