import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { Param, ParseIntPipe, Body, Query } from '@nestjs/common';
import { Canon } from '@prisma/client';

import { User, Roles } from '@shared/common';
import { UpdateCanonDTO, User as UserModel } from '@models';

import { CanonService } from './canon.service';

@Controller('canon')
export class CanonController {
  constructor(private readonly canonService: CanonService) {}

  @Get('/')
  @Roles('ADMIN')
  public async getCanons(): Promise<Canon[]> {
    return await this.canonService.getCanons();
  }

  @Get('/:week')
  public async getCanon(
    @User() user: UserModel,
    @Param('week', ParseIntPipe) week: number,
    @Query('dyslexia') forceDyslexia: string
  ): Promise<string> {
    const dyslexia = user.child?.dyslexia || forceDyslexia === 'force';
    const { base64, altbase64 } = await this.canonService.getCanonByWeek(week);
    return dyslexia ? altbase64 || base64 : base64;
  }

  @Post('/')
  public async createCanon(@Body() canon: UpdateCanonDTO): Promise<Canon> {
    return await this.canonService.createCanon(canon);
  }

  @Put('/:week')
  public async updateCanon(
    @Param('week', ParseIntPipe) week: number,
    @Body() canon: UpdateCanonDTO
  ): Promise<Canon> {
    return await this.canonService.updateCanon(week, canon);
  }

  @Delete('/:week')
  public async deleteCanon(@Param('week', ParseIntPipe) week: number): Promise<string> {
    await this.canonService.deleteCanon(week);
    return `Deleted canon for week ${week}!`;
  }
}
