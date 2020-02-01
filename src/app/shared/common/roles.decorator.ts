import { SetMetadata } from '@nestjs/common';

import { AdminRole } from '@models';

/**
 * @description Sets meta data on a NestJS route so that
 * the JWT guard will not active the route unless the user
 * has the specified role.
 * @param {...AdminRole[]} roles
 */
export const Roles = (...roles: AdminRole[]) => SetMetadata('roles', roles);
