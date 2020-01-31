import { Controller, Get, Post, Put, Delete, Body, ParseIntPipe, Param } from '@nestjs/common';

import { Cohort, DueDates } from '@prisma/client';
import { UpdateCohortDTO } from '@models';
import { Roles } from '@shared/common';

import { CohortService } from './cohort.service';

@Controller('cohorts')
export class CohortController {
  constructor(private readonly cohortService: CohortService) {}

  @Get('/')
  @Roles('ADMIN')
  public async getCohorts(): Promise<Cohort[]> {
    return this.cohortService.getCohorts();
  }

  @Get('/:id')
  @Roles('ADMIN')
  public async getCohort(@Param('id', ParseIntPipe) id: number): Promise<Cohort> {
    return this.cohortService.getCohort(id);
  }

  @Get('/:id/dates')
  @Roles('ADMIN')
  public async getDueDates(@Param('id', ParseIntPipe) id: number): Promise<DueDates[]> {
    return await this.cohortService.getDueDates(id);
  }

  @Post('/')
  @Roles('ADMIN')
  public async addCohort(@Body() cohort: UpdateCohortDTO): Promise<Cohort> {
    return this.cohortService.addCohort(cohort);
  }

  @Post('/:id/dates')
  @Roles('ADMIN')
  public async addDueDates(@Param('id', ParseIntPipe) id: number): Promise<DueDates> {
    return await this.cohortService.addDueDates(id);
  }

  @Put('/:id')
  @Roles('ADMIN')
  public async updateCohort(
    @Param('id', ParseIntPipe) id: number,
    @Body() cohort: UpdateCohortDTO
  ): Promise<Cohort> {
    return await this.cohortService.updateCohort(id, cohort);
  }

  @Delete('/:id')
  @Roles('ADMIN')
  public async deleteCohort(@Param('id', ParseIntPipe) id: number): Promise<string> {
    await this.cohortService.deleteCohort(id);
    return `Deleted cohort ${id}!`;
  }
}
