import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateSubmissionDTO } from '@models';
import { PrismaService } from '@shared/prisma';
import { TranscriptionService } from '../../shared/transcription';

@Injectable()
export class SubmissionService {
  constructor(private readonly prisma: PrismaService, private readonly transcription: TranscriptionService) {}

  public async getSubmissions(childID: number) {
    return await this.prisma.child.findOne({ where: { id: childID } }).submissions();
  }

  public async getSubmission(childID: number, id: number) {
    const [submission] = await this.prisma.child.findOne({ where: { id: childID } }).submissions({ where: { id } });
    if (!submission) throw new NotFoundException();
    return submission;
  }

  public async getSubmissionByWeek(childID: number, week: number) {
    const [submission] = await this.prisma.child.findOne({ where: { id: childID } }).submissions({ where: { week } });
    if (!submission) throw new NotFoundException();
    return submission;
  }

  public async createSubmission(childID: number, week: number, submission: UpdateSubmissionDTO) {
    const metadata = { week, child: { connect: { id: childID } } };
    const { images } = await this.transcription.process({ images: [submission.story] }).toPromise();
    const storyText = images[0];
    return await this.prisma.submission.create({ data: { ...submission, storyText, ...metadata } });
  }

  public async updateSubmission(childID: number, id: number, update: UpdateSubmissionDTO) {
    await this.getSubmission(childID, id);
    return await this.prisma.submission.update({ data: { ...update }, where: { id } });
  }

  public async deleteSubmission(childID: number, id: number) {
    await this.getSubmission(childID, id);
    await this.prisma.submission.delete({ where: { id } });
  }

  public async deleteSubmissionByWeek(childID: number, week: number) {
    await this.getSubmissionByWeek(childID, week);
    await this.prisma.submission.deleteMany({ where: { week } });
  }

  public async getSubmissionWeek(childID: number) {
    const { week } = await this.prisma.child.findOne({ where: { id: childID } }).cohort();
    return week;
  }
}
