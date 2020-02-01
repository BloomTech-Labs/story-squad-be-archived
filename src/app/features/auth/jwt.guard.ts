import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { User, AdminRole } from '@models';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /**
   * @description The global guard that extracts the JWT from the header
   * and determines if the user is allowed to access a given route
   * @param {ExecutionContext} context
   * @returns a boolean that indicates if the request is authorized or
   * forbidden, if the return result is false the request will be rejected
   * with an HTTP Error of Forbidden
   * @memberof JwtGuard
   */
  public async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true;

    const jwtActivated = (await super.canActivate(context)) as boolean;

    const user = context.switchToHttp().getRequest().user as User;
    const requiredRoles = this.reflector.get<AdminRole[]>('roles', context.getHandler());
    const hasRole = requiredRoles?.some((role) => user.admin?.role === role);

    const notActiveSubscription = user.child?.subscription === '';
    return (hasRole || !requiredRoles) && jwtActivated && !notActiveSubscription;
  }
}
