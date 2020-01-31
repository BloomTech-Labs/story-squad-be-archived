import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';

import { UpdateProgressDTO, UpdateChildDTO } from '@models';
import { PrismaService } from '@shared/prisma';
import { AuthService } from '@features/auth/auth.service';

@Injectable()
export class ChildService {
  constructor(private readonly prisma: PrismaService, private readonly auth: AuthService) {}

  public getChildRepo(id: number) {
    return this.prisma.children.findOne({ where: { id } });
  }

  public async getParent(childID: number) {
    const { password, ...parent } = await this.getChildRepo(childID).parent();
    return parent;
  }

  public async getCohort(childID: number) {
    return await this.getChildRepo(childID).cohort();
  }

  public async getPreferences(childID: number) {
    const { dyslexia } = await this.getChildRepo(childID);
    return { dyslexia };
  }

  public async getProgress(childID: number) {
    const { week } = await this.getChildRepo(childID).cohort();
    const progresses = await this.getChildRepo(childID).progress({ where: { week } });
    return progresses.pop();
  }

  public async updateProgress(childID: number, update: UpdateProgressDTO) {
    const { id } = await this.getProgress(childID);
    return await this.prisma.progresses.update({ where: { id }, data: { ...update } });
  }

  public async loginChild(parentID: number, childID: number) {
    await this.getChild(parentID, childID);
    return this.auth.loginChild(childID);
  }

  public async getChildren(id: number) {
    return await this.prisma.parents.findOne({ where: { id } }).children();
  }

  public async getChild(id: number, childID: number) {
    const [child] = await this.prisma.parents
      .findOne({ where: { id } })
      .children({ where: { id: childID } });
    if (!child) throw new NotFoundException();
    return child;
  }

  public async addChild(parentID: number, child: UpdateChildDTO) {
    const { id } = (await this.prisma.cohorts({ where: { week: 1 } })).pop();

    // TODO: Setup Automatic Cohort Generation
    if (!id)
      throw new ServiceUnavailableException(
        'No cohorts are available, please contact an admin to create a new cohort!'
      );

    return await this.prisma.children.create({
      data: {
        ...child,
        parent: { connect: { id: parentID } },
        cohort: { connect: { id } },
      },
    });
  }

  public async updateChild(parentID: number, childID: number, update: UpdateChildDTO) {
    const child = await this.getChild(parentID, childID);
    return await this.prisma.children.update({
      where: { id: childID },
      data: { ...child, ...update },
    });
  }

  public async deleteChild(parentID: number, childID: number) {
    await this.getChild(parentID, childID);
    await this.deleteSubmissions(childID);
    await this.deleteProgress(childID);
    await this.prisma.children.delete({ where: { id: childID } });
  }

  public async deleteProgress(childID: number) {
    const progresses = await this.getChildRepo(childID).progress();
    const progressIDs = progresses.map((progress) => progress.id);
    for (const id of progressIDs) this.prisma.progresses.delete({ where: { id } });
  }

  public async deleteSubmissions(childID: number) {
    const submissions = await this.getChildRepo(childID).submissions();
    const submissionIDs = submissions.map((submission) => submission.id);
    for (const id of submissionIDs) this.prisma.submissions.delete({ where: { id } });
  }
}
