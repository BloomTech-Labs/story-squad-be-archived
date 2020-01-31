import { IsString, IsEmail, IsEnum } from 'class-validator';

import { AdminRole } from '@models';

enum Role {
  'ADMIN',
  'MODERATOR',
}

export class AdminRegisterDTO {
  @IsString()
  @IsEmail()
  public email: string;

  @IsEnum(Role, { message: 'role must be either ADMIN or MODERATOR' })
  public role: AdminRole;
}
