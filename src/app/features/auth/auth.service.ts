import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientRequestError } from '@prisma/client';

import { hash, compare } from 'bcryptjs';
import { randomPassword } from 'secure-random-password';

import { salt } from '@environment';
import { RegisterDTO, LoginDTO, Parent, Admin, JWT, AdminRegisterDTO } from '@models';
import { PrismaService } from '@shared/prisma/prisma.service';
import { StripeService } from '@shared/stripe/stripe.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
    private readonly stripe: StripeService
  ) {}

  public async registerParent({ email, password, ...discarded }: RegisterDTO) {
    try {
      password = await hash(password, salt);
      const { id: stripeID } = await this.stripe.customers.create({ email });
      const data = { email, password, stripeID };
      const { id: parentID } = await this.prisma.parents.create({ data });
      return this.jwt.sign({ parentID });
    } catch (err) {
      if (err instanceof PrismaClientRequestError) {
        throw new BadRequestException(
          'Failed to create account... Do you already have an account?'
        );
      } else {
        throw new InternalServerErrorException('An unexpected error occurred...');
      }
    }
  }

  public async registerAdmin({ email, role }: AdminRegisterDTO) {
    try {
      const characters = '!#%+23456789:=?@ABCDEFGHJKLMNPRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      const plainPassword = randomPassword({ length: 8, characters });
      const password = await hash(plainPassword, salt);
      const admin = await this.prisma.admins.create({ data: { email, role, password } });
      return { ...admin, password: plainPassword };
    } catch (err) {
      if (err instanceof PrismaClientRequestError) {
        throw new BadRequestException(
          'Failed to create account... Do you already have an account?'
        );
      } else {
        throw new InternalServerErrorException('An unexpected error occurred...');
      }
    }
  }

  public async login({ email, password }: LoginDTO) {
    try {
      const admin = await this.validateAdmin({ email, password });
      const parent = await this.validateParent({ email, password });
      if (!admin && !parent) throw new UnauthorizedException();
      const jwt: JWT = { adminID: admin?.id, parentID: parent?.id };
      return this.jwt.sign(jwt);
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new InternalServerErrorException('An unexpected error occurred...');
    }
  }

  public async loginChild(childID: string | number) {
    const jwt: JWT = { childID };
    return this.jwt.sign(jwt);
  }

  public async validateParent({ email, password }: LoginDTO) {
    try {
      const parent = await this.prisma.parents.findOne({ where: { email } });
      if (!(await compare(password, parent?.password))) throw new Error();
      return parent;
    } catch {
      return undefined;
    }
  }

  public async validateAdmin({ email, password }: LoginDTO) {
    try {
      const admin =
        (await this.prisma.admins.findOne({ where: { email } })) ||
        (await this.setupDefaultAdmin({ email, password }));

      if (!(await compare(password, admin?.password))) throw new Error();
      return admin;
    } catch {
      return undefined;
    }
  }

  public async setupDefaultAdmin({ email, password }: LoginDTO) {
    if (email !== 'admin') return;
    return await this.prisma.admins.create({
      data: { email, password: await hash(password, salt), role: 'ADMIN' },
    });
  }

  public async updatePassword(email: string, password: string) {
    password = await hash(password, salt);
    await this.prisma.admins.update({ data: { password }, where: { email } });
  }
}
