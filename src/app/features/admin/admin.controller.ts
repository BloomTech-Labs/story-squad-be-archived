import { Controller, Get, Post, Put, Param, Body, ParseIntPipe } from '@nestjs/common';

import { Admin, AdminRegisterDTO, AdminPasswordDTO } from '@models';
import { User, Roles } from '@shared/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/me')
  public async whoAmI(@User('admin') admin: Admin): Promise<Omit<Admin, 'password'>> {
    const { password, ...details } = admin;
    return details;
  }

  @Put('/me')
  public async updatePassword(
    @User('admin') admin: Admin,
    @Body() update: AdminPasswordDTO
  ): Promise<void> {
    return await this.adminService.updatePassword(admin.email, update);
  }

  @Get('/')
  @Roles('ADMIN')
  public async getAll(): Promise<Omit<Admin, 'password'>[]> {
    return await this.adminService.getAdmins();
  }

  @Get('/:id')
  @Roles('ADMIN')
  public async getAdmin(@Param('id', ParseIntPipe) id: number): Promise<Omit<Admin, 'password'>> {
    return await this.adminService.getAdmin(id);
  }

  @Post('/create')
  @Roles('ADMIN')
  public async createAdmin(@Body() register: AdminRegisterDTO): Promise<string> {
    return await this.adminService.create(register);
  }
}
