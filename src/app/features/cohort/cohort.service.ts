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

  public async getCohort(id: number) {
    return await this.prisma.cohorts.findOne({ where: { id } });
  }

  public async getDueDates(id: number) {
    return await this.prisma.cohorts.findOne({ where: { id } }).dueDates();
  }

  public async addCohort(cohort: UpdateCohortDTO) {
    const defaults = { activity: 'reading', week: 1 };
    const created = await this.prisma.cohorts.create({ data: { ...cohort, ...defaults } });
    await this.addDueDates(created.id);
    return created;
  }

  public async updateCohort(id: number, cohort: UpdateCohortDTO) {
    return await this.prisma.cohorts.update({ data: cohort, where: { id } });
  }

  public async deleteCohort(id: number) {
    await this.prisma.cohorts.delete({ where: { id } });
  }

  public async addDueDates(cohortID: number) {
    const dueDates = { reading: new Date(), submission: new Date() };
    const { id } = await this.prisma.dueDates.create({ data: dueDates });
    const { week } = await this.prisma.cohorts.update({
      data: { dueDates: { connect: { id } } },
      where: { id: cohortID },
    });

    const children = await this.prisma.cohorts.findOne({ where: { id: cohortID } }).children();
    const childrenIDs = children.map((child) => child.id);
    for (const id of childrenIDs) {
      await this.prisma.progresses.create({
        data: { week, child: { connect: { id } } },
      });
    }
  }
}
