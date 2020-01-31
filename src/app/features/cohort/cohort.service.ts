import { Injectable } from '@nestjs/common';

import { Cohort } from '@prisma/client';
import { UpdateCohortDTO } from '@models';
import { PrismaService } from '@shared/prisma';

@Injectable()
export class CohortService {
  constructor(private readonly prisma: PrismaService) {}

  public async getCohorts() {
    return await this.prisma.cohorts();
  }

  public async addCohort(cohort: UpdateCohortDTO) {
    const dueDates = { create: { reading: new Date(), submission: new Date() } };
    const defaults = { activity: 'reading', week: 1, dueDates };
    return await this.prisma.cohorts.create({ data: { ...cohort, ...defaults } });
  }

  public async updateCohort(id: number, cohort: UpdateCohortDTO) {
    return await this.prisma.cohorts.update({ data: cohort, where: { id } });
  }

  public async deleteCohort(id: number) {
    await this.prisma.cohorts.delete({ where: { id } });
  }
}
