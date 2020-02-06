import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateSubmissionDTO } from '@models';
import { PrismaService } from '@shared/prisma';
import { ScriptService } from '@app/shared/script';
import { attemptJSONParse, onlyTranscription } from '@utils';

@Injectable()
export class SubmissionService {
  constructor(private readonly prisma: PrismaService, private readonly transcription: ScriptService) {}

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
    const storyText = submission.storyText || (await this.transcribe(submission.story)).images.join('\n');
    return await this.prisma.submission.create({
      data: {
        illustration: { set: submission.illustration },
        story: { set: submission.story },
        storyText,
        ...metadata,
      },
    });
  }

  public async upsertSubmission(childID: number, id: number, update: UpdateSubmissionDTO) {
    await this.getSubmission(childID, id);
    const storyText = update.storyText || (await this.transcribe(update.story)).images.join('\n');
    return await this.prisma.submission.update({
      data: {
        ...update,
        illustration: { set: update.illustration },
        story: { set: update.story },
        storyText,
      },
      where: { id },
    });
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

  public transcribe(images: string[]) {
    return this.transcription.runScript('./data-science/transcription.py', { images }, (out) =>
      out.map(attemptJSONParse).find(onlyTranscription)
    );
  }
}
