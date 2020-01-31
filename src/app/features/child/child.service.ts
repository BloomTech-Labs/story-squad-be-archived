import { Injectable, NotFoundException } from '@nestjs/common';

import { ChildClient, Cohort, Preferences, Progress } from '@prisma/client';
import { Child, Parent, UpdateProgressDTO, UpdateChildDTO } from '@models';
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
    return await this.getChildRepo(childID).preferences();
  }

  public async getProgress(childID: number) {
    const progresses = await this.getChildRepo(childID).progress();
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

  public async addChild(id: number, child: UpdateChildDTO) {
    const cohort = (await this.prisma.cohorts({ where: { week: 1 } })).pop();
    return await this.prisma.children.create({
      data: {
        ...child,
        parent: { connect: { id } },
        cohort: { connect: cohort },
        preferences: { create: {} },
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
    await this.prisma.children.delete({ where: { id: childID } });
  }
}
