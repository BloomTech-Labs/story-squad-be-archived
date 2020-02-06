import { Request } from 'express';
import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import { User as UserModel } from '@models';

/**
 * @description extracts the `req.user` from the incoming request and assigns
 * it to the given parameter.
 *
 * Throws an error if the user object is undefined
 *
 * @param {keyof UserModel} key changes extraction to `req.user[key]` instead
 */
export const User = createParamDecorator((key: keyof UserModel, req: Request) => {
  if (!req.user || !(req.user as UserModel)[key]) throw new UnauthorizedException();
  return key ? (req.user as UserModel)[key] : req.user;
});
