import { Controller, Post, Body } from '@nestjs/common';

import { RegisterDTO, LoginDTO } from '@models';
import { Public } from '@shared/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('/register')
  public async register(@Body() register: RegisterDTO): Promise<string> {
    return this.auth.registerParent(register);
  }

  @Public()
  @Post('/login')
  public async login(@Body() login: LoginDTO): Promise<string> {
    return this.auth.login(login);
  }
}
