import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';

import { UpdateProgressDTO, UpdateChildDTO } from '@models';
import { PrismaService } from '@shared/prisma';
import { StripeService } from '@shared/stripe';
import { AuthService } from '@features/auth/auth.service';

@Injectable()
export class ChildService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
    private readonly stripe: StripeService
  ) {}

  public getChildRepo(id: number) {
    return this.prisma.child.findOne({ where: { id } });
  }

  public async getMe(id: number) {
    const child = await this.prisma.child.findOne({
      where: { id },
      include: { cohort: true },
    });
    const progress = [await this.getProgress(id)];
    return { ...child, progress };
  }

  public async getParent(childID: number) {
    const { password, ...parent } = await this.getChildRepo(childID).parent();
    return parent;
  }

  public async getCohort(childID: number) {
    return await this.getChildRepo(childID).cohort({ include: { dueDates: true } });
  }

  public async getPreferences(childID: number) {
    const { dyslexia } = await this.getChildRepo(childID);
    return { dyslexia };
  }

  public async getProgress(childID: number) {
    const { week } = await this.getChildRepo(childID).cohort();
    const progresses = await this.getChildRepo(childID).progress({ where: { week } });
    return progresses.pop() || (await this.createProgress(childID));
  }

  public async createProgress(childID: number) {
    const { week } = await this.getChildRepo(childID).cohort();
    return await this.prisma.progress.create({
      data: { week, child: { connect: { id: childID } } },
    });
  }

  public async updateProgress(childID: number, update: UpdateProgressDTO) {
    const progress = await this.getProgress(childID);
    const { id } = progress;
    return await this.prisma.progress.update({ where: { id }, data: { ...update } });
  }

  public async loginChild(parentID: number, childID: number) {
    await this.getChild(parentID, childID);
    return this.auth.loginChild(childID);
  }

  public async getChildren(id: number) {
    return await this.prisma.parent.findOne({ where: { id } }).children({ include: { cohort: true } });
  }

  public async getChild(id: number, childID: number) {
    const [child] = await this.prisma.parent
      .findOne({ where: { id } })
      .children({ where: { id: childID }, include: { cohort: true } });
    if (!child) throw new NotFoundException();
    return child;
  }

  public async addChild(parentID: number, child: UpdateChildDTO) {
    const cohort = (await this.prisma.cohort.findMany({ where: { week: 1 } })).pop();

    // TODO: Setup Automatic Cohort Generation
    if (!cohort)
      throw new ServiceUnavailableException(
        'No cohorts are available, please contact an admin to create a new cohort!'
      );

    return await this.prisma.child.create({
      data: {
        ...child,
        parent: { connect: { id: parentID } },
        cohort: { connect: { id: cohort.id } },
      },
    });
  }

  public async updateChild(parentID: number, childID: number, update: UpdateChildDTO) {
    await this.getChild(parentID, childID);
    return await this.prisma.child.update({
      where: { id: childID },
      data: { ...update },
    });
  }

  public async deleteChild(parentID: number, childID: number) {
    const { subscription } = await this.getChild(parentID, childID);
    await this.prisma.submission.deleteMany({ where: { child: { id: childID } } });
    await this.prisma.progress.deleteMany({ where: { id: childID } });
    await this.prisma.child.delete({ where: { id: childID } });
    await this.stripe.subscriptions.del(subscription);
  }

  public async deleteProgress(childID: number) {
    const progresses = await this.getChildRepo(childID).progress();
    const progressIDs = progresses.map((progress) => progress.id);
    for (const id of progressIDs) this.prisma.progress.delete({ where: { id } });
  }
}
