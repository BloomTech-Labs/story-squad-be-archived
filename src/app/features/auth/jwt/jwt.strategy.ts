import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { secret } from '@environment';
import { JWT, User } from '@models';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * @description Called from the JWT guard's `canActivate()`, after
   * decoding a JWT this function serializes the data.
   *
   * Check out [Authentication](https://docs.nestjs.com/techniques/authentication)
   * for more information
   *
   * @param {JWT} decoded the data from the JWT after being decoded
   * @returns {Promise<User>} The result of this function will be assigned
   * to `req.user`.
   *
   * `req.user` is in the `User` model shape, where it
   * contains the admin, parent and child user information if they all
   * exist for the given JTW. There should never be a time where a child
   * is an Admin or Parent, however a Parent could also be an Admin as long
   * as the Admin username/password and Parent username/password are the same.
   * @memberof JWTStrategy
   */
  public async validate({ adminID, parentID, childID }: JWT): Promise<User> {
    const admin = adminID ? await this.prisma.admin.findOne({ where: { id: Number(adminID) } }) : undefined;
    const parent = parentID ? await this.prisma.parent.findOne({ where: { id: Number(parentID) } }) : undefined;
    const child = childID ? await this.prisma.child.findOne({ where: { id: Number(childID) } }) : undefined;
    return { admin, parent, child };
  }
}
