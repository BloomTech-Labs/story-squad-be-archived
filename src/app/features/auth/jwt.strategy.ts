import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { secret } from '@environment';
import { JWT, User } from '@models';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * @description Called from the JWT guard's `canActivate()`, after
   * decoding a JWT this function serializes the data and returns what
   * will be assigned to `req.user`
   * @param {JWT} decoded the data from the JWT after being decoded
   * @returns {Promise<User>}
   * @memberof JwtStrategy
   */
  public async validate({ adminID, parentID, childID }: JWT): Promise<User> {
    const admin = adminID ? await this.prisma.admin.findOne({ where: { id: Number(adminID) } }) : undefined;
    const parent = parentID ? await this.prisma.parent.findOne({ where: { id: Number(parentID) } }) : undefined;
    const child = childID ? await this.prisma.child.findOne({ where: { id: Number(childID) } }) : undefined;
    return { admin, parent, child };
  }
}
