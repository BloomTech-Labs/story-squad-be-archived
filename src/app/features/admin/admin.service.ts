import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma';

import { AdminRegisterDTO, AdminPasswordDTO } from '@models';
import { AuthService } from '@features/auth/auth.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService, private readonly auth: AuthService) {}

  public async getAdmins() {
    const admins = await this.prisma.admins();
    const withoutPassword = admins.map(({ password, ...details }) => details);
    return withoutPassword;
  }

  public async getAdmin(id: number) {
    const { password, ...details } = await this.prisma.admins.findOne({ where: { id } });
    return details;
  }

  public async create({ email, role }: AdminRegisterDTO) {
    return await this.auth.registerAdmin({ email, role });
  }

  public async updatePassword(email: string, { password }: AdminPasswordDTO) {
    return await this.auth.updatePassword(email, password);
  }
}
