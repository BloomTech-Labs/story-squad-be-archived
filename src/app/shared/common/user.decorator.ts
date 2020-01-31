import { Request } from 'express';
import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import { User as UserModel } from '@models';

export const User = createParamDecorator((key: keyof UserModel, req: Request) => {
  const user = key ? (req.user as UserModel)[key] : req.user;
  if (!user) throw new UnauthorizedException();
  return user;
});
