import { Controller, Get, Post, Put, Delete, Param, ParseIntPipe, Body } from '@nestjs/common';

import { Submission } from '@prisma/client';
import { Child, UpdateSubmissionDTO } from '@models';
import { User } from '@shared/common';

import { SubmissionService } from './submission.service';

@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Get('/')
  public async getSubmissions(@User('child') { id }: Child): Promise<Submission[]> {
    return await this.submissionService.getSubmissions(id);
  }

  @Get('/:week')
  public async getSubmission(
    @User('child') { id }: Child,
    @Param('week', ParseIntPipe) week: number
  ): Promise<Submission> {
    return await this.submissionService.getSubmissionByWeek(id, week);
  }

  @Post('/')
  public async createSubmission(
    @User('child') { id }: Child,
    @Body() submission: UpdateSubmissionDTO
  ): Promise<Submission> {
    const week = await this.submissionService.getSubmissionWeek(id);
    return await this.submissionService.createSubmission(id, week, submission);
  }

  @Put('/:id')
  public async updateSubmission(
    @User('child') { id }: Child,
    @Param('id', ParseIntPipe) submissionID: number,
    @Body() update: UpdateSubmissionDTO
  ): Promise<Submission> {
    return await this.submissionService.updateSubmission(id, submissionID, update);
  }

  @Delete('/:week')
  public async deleteSubmission(
    @User('child') { id }: Child,
    @Param('week', ParseIntPipe) week: number
  ): Promise<string> {
    await this.submissionService.deleteSubmissionByWeek(id, week);
    return `Deleted submission ${id}!`;
  }
}
