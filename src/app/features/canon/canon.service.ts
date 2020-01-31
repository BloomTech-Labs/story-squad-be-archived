import { Injectable, NotFoundException } from '@nestjs/common';
import { Canon } from '@prisma/client';

import { UpdateCanonDTO } from '@models';
import { PrismaService } from '@shared/prisma';

@Injectable()
export class CanonService {
  constructor(private readonly prisma: PrismaService) {}

  public async getCanons() {
    return await this.prisma.canons();
  }

  public async getCanonByWeek(week: number) {
    const canon = await this.prisma.canons.findOne({ where: { week } });
    if (!canon) throw new NotFoundException();
    return canon;
  }

  public async createCanon(canon: UpdateCanonDTO) {
    return await this.prisma.canons.create({ data: canon });
  }

  public async updateCanon(week: number, canon: UpdateCanonDTO) {
    await this.getCanonByWeek(week);
    return await this.prisma.canons.update({ data: canon, where: { week } });
  }

  public async deleteCanon(week: number) {
    await this.getCanonByWeek(week);
    await this.prisma.canons.delete({ where: { week } });
  }

  public async dyslexicPreference(id: number) {
    const { dyslexia } = await this.prisma.children.findOne({ where: { id } }).preferences();
    return dyslexia;
  }
}
