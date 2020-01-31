import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateCanonDTO } from '@models';
import { PrismaService } from '@shared/prisma';

@Injectable()
export class CanonService {
  constructor(private readonly prisma: PrismaService) {}

  public async getCanons() {
    return await this.prisma.canon.findMany();
  }

  public async getCanonByWeek(week: number) {
    const canon = await this.prisma.canon.findOne({ where: { week } });
    if (!canon) throw new NotFoundException('Could not locate canon!');
    return canon;
  }

  public async createCanon(canon: UpdateCanonDTO) {
    return await this.prisma.canon.upsert({
      create: canon,
      update: canon,
      where: { week: canon.week },
    });
  }

  public async updateCanon(week: number, canon: UpdateCanonDTO) {
    await this.getCanonByWeek(week);
    return await this.prisma.canon.update({ data: canon, where: { week } });
  }

  public async deleteCanon(week: number) {
    await this.getCanonByWeek(week);
    await this.prisma.canon.delete({ where: { week } });
  }
}
