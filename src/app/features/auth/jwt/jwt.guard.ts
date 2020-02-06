import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { User, AdminRole } from '@models';

@Injectable()
export class JWTGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /**
   * @description The global guard that extracts the JWT from the header
   * and determines if the user is allowed to access a given route
   *
   * This guard calls the JWT Passport Strategy as defined in `jwt.strategy`
   * when `super.canActivate()` is called, this will decode the JWT from
   * the Authentication Header then use the `validate()` method from the
   * Strategy to assign `req.user`. If a JWT doesn't exist then the
   * `super.canActivate()` will throw a `Forbidden Exception` which will
   * return a rejected response. For this reason it is important that any
   * Public labeled routes return `true` before `super.canActivate()` is
   * called.
   *
   * Check out [Authentication](https://docs.nestjs.com/techniques/authentication)
   * for more information
   *
   * @param {ExecutionContext} context contains data about the context on which
   * what route is being called, such as the request and response objects and
   * the handler.
   * @returns a boolean that indicates if the request is authorized or
   * forbidden, if the return result is false the request will be rejected
   * with an HTTP Error of Forbidden
   * @memberof JWTGuard
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
