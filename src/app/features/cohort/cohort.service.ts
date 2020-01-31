import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';

import { UpdateCohortDTO } from '@models';
import { PrismaService } from '@shared/prisma';
import { PrismaClientRequestError } from '@prisma/client';

@Injectable()
export class CohortService {
  constructor(private readonly prisma: PrismaService) {}

  public async getCohorts() {
    return await this.prisma.cohort.findMany();
  }

  public async getCohort(id: number) {
    return await this.prisma.cohort.findOne({ where: { id } });
  }

  public async getDueDates(id: number) {
    return await this.prisma.cohort.findOne({ where: { id } }).dueDates();
  }

  public async addCohort(cohort: UpdateCohortDTO) {
    try {
      const defaults = { activity: 'reading', week: 1 };
      const created = await this.prisma.cohort.create({ data: { ...cohort, ...defaults } });
      await this.addDueDates(created.id);
      return created;
    } catch (err) {
      if (err instanceof PrismaClientRequestError)
        throw new BadRequestException(
          'Could not create cohort, does another cohort with the same name exist?'
        );
      else throw err;
    }
  }

  public async updateCohort(id: number, cohort: UpdateCohortDTO) {
    return await this.prisma.cohort.update({ data: cohort, where: { id } });
  }

  public async deleteCohort(id: number) {
    try {
      await this.prisma.dueDates.deleteMany({ where: { cohort: { id } } });
      await this.prisma.cohort.delete({ where: { id } });
    } catch (err) {
      throw new BadRequestException('Could not delete Cohort. Are there students in it?');
    }
  }

  public async addDueDates(cohortID: number) {
    const { week } = await this.prisma.cohort.findOne({ where: { id: cohortID } });

    const data = { week, reading: new Date(), submission: new Date() };
    const dueDates = await this.prisma.dueDates.create({ data });
    await this.prisma.cohort.update({
      data: { dueDates: { connect: { id: dueDates.id } } },
      where: { id: cohortID },
    });

    const children = await this.prisma.cohort.findOne({ where: { id: cohortID } }).children();
    const childrenIDs = children.map((child) => child.id);
    for (const id of childrenIDs) {
      await this.prisma.progress.create({
        data: { week, child: { connect: { id } } },
      });
    }

    return dueDates;
  }
}
