import { Controller, Get } from '@nestjs/common';

import { Parent } from '@models';
import { User } from '@shared/common';

@Controller('parents')
export class ParentController {
  @Get('/me')
  public async whoAmI(@User('parent') user: Parent) {
    const { password, stripeID, ...me } = user;
    return me;
  }
}
