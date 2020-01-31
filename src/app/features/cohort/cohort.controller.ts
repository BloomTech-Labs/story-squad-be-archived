import { Controller, Get, Post, Put, Delete, Body, ParseIntPipe, Param } from '@nestjs/common';

import { Cohort } from '@prisma/client';
import { UpdateCohortDTO } from '@models';
import { Roles } from '@shared/common';

import { CohortService } from './cohort.service';

@Controller('cohort')
export class CohortController {
  constructor(private readonly cohortService: CohortService) {}

  @Get('/')
  @Roles('ADMIN')
  public async listCohorts(): Promise<Cohort[]> {
    return this.cohortService.getCohorts();
  }

  @Post('/')
  @Roles('ADMIN')
  public async addCohort(@Body() cohort: UpdateCohortDTO): Promise<Cohort> {
    return this.cohortService.addCohort(cohort);
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
  public async deleteCohort(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.cohortService.deleteCohort(id);
  }
}
