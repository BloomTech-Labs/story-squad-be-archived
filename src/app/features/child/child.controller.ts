import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, Delete } from '@nestjs/common';

import { Cohort, Progress } from '@prisma/client';
import { User } from '@shared/common';
import { Child, Parent, UpdateProgressDTO, UpdateChildDTO, PreferencesDTO } from '@models';
import { ChildService } from './child.service';

@Controller('children')
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @Get('/me')
  public async whoAmI(@User('child') child: Child): Promise<Child> {
    return child;
  }

  @Get('/parent')
  public async getParent(@User('child') { id }: Child): Promise<Omit<Parent, 'password'>> {
    return await this.childService.getParent(id);
  }

  @Get('cohort')
  public async getCohort(@User('child') { id }: Child): Promise<Cohort> {
    return await this.childService.getCohort(id);
  }

  @Get('/preferences')
  public async getMyPreferences(@User('child') { id }: Child): Promise<PreferencesDTO> {
    return await this.childService.getPreferences(id);
  }

  @Get('/progress')
  public async getCurrentProgress(@User('child') { id }: Child): Promise<Progress> {
    return await this.childService.getProgress(id);
  }

  @Post('/progress')
  public async updateProgress(
    @User('child') { id }: Child,
    @Body() update: UpdateProgressDTO
  ): Promise<Progress> {
    return await this.childService.updateProgress(id, update);
  }

  @Post('/login/:id')
  public async childLogin(
    @User('parent') { id }: Parent,
    @Param('id', ParseIntPipe) childID: number
  ): Promise<string> {
    return await this.childService.loginChild(id, childID);
  }

  @Get('/')
  public async getChildren(@User('parent') { id }: Parent): Promise<Child[]> {
    return await this.childService.getChildren(id);
  }

  @Get('/:id')
  public async getChild(
    @User('parent') { id }: Parent,
    @Param('id', ParseIntPipe) childID: number
  ): Promise<Child> {
    return await this.childService.getChild(id, childID);
  }

  @Post('/')
  public async addChild(
    @User('parent') { id }: Parent,
    @Body() child: UpdateChildDTO
  ): Promise<Child> {
    return await this.childService.addChild(id, child);
  }

  @Put('/:id')
  public async updateChild(
    @User('parent') { id }: Parent,
    @Param('id', ParseIntPipe) childID: number,
    @Body() update: UpdateChildDTO
  ): Promise<Child> {
    return await this.childService.updateChild(id, childID, update);
  }

  @Delete('/:id')
  public async deleteChild(
    @User('parent') { id }: Parent,
    @Param('id', ParseIntPipe) childID: number
  ): Promise<void> {
    await this.childService.deleteChild(id, childID);
  }
}
