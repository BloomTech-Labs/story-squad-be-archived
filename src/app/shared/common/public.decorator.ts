import { SetMetadata } from '@nestjs/common';

/**
 * @description Sets meta data on a NestJS Route so that
 * incoming request to that route bypass the JWT Guard
 */
export const Public = () => SetMetadata('isPublic', true);
