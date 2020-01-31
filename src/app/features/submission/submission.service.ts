import { Injectable, NotFoundException } from '@nestjs/common';
import { Submission } from '@prisma/client';

import { UpdateSubmissionDTO } from '@models';
import { PrismaService } from '@shared/prisma';

@Injectable()
export class SubmissionService {
  constructor(private readonly prisma: PrismaService) {}

  public async getSubmissions(childID: number) {
    return await this.prisma.children.findOne({ where: { id: childID } }).submissions();
  }

  public async getSubmission(childID: number, id: number) {
    const [submission] = await this.prisma.children
      .findOne({ where: { id: childID } })
      .submissions({ where: { id } });
    if (!submission) throw new NotFoundException();
    return submission;
  }

  public async createSubmission(childID: number, week: number, submission: UpdateSubmissionDTO) {
    const metadata = { week, child: { connect: { id: childID } } };
    return await this.prisma.submissions.create({ data: { ...submission, ...metadata } });
  }

  public async updateSubmission(childID: number, id: number, update: UpdateSubmissionDTO) {
    await this.getSubmission(childID, id);
    return await this.prisma.submissions.update({ data: { ...update }, where: { id } });
  }

  public async deleteSubmission(childID: number, id: number) {
    await this.getSubmission(childID, id);
    await this.prisma.submissions.delete({ where: { id } });
  }

  public async getSubmissionWeek(childID: number) {
    const { week } = await this.prisma.children.findOne({ where: { id: childID } }).cohort();
    return week;
  }
}
