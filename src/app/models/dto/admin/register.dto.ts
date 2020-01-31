import { IsString, IsEmail, IsEnum } from 'class-validator';

import { AdminRole } from '@models';

export class AdminRegisterDTO {
  @IsString()
  @IsEmail()
  public email: string;

  @IsEnum(AdminRole, { message: 'role must be either ADMIN or MODERATOR' })
  public role: AdminRole;
}
