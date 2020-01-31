import { SetMetadata } from '@nestjs/common';

import { AdminRole } from '@models';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const Roles = (...roles: AdminRole[]) => SetMetadata('roles', roles);
