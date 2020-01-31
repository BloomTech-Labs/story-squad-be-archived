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

  public async validate({ adminID, parentID, childID }: JWT): Promise<User> {
    const admin = adminID
      ? await this.prisma.admins.findOne({ where: { id: Number(adminID) } })
      : undefined;

    const parent = parentID
      ? await this.prisma.parents.findOne({ where: { id: Number(parentID) } })
      : undefined;

    const child = childID
      ? await this.prisma.children.findOne({ where: { id: Number(childID) } })
      : undefined;

    return { admin, parent, child };
  }
}
