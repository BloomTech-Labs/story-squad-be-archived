import { Admin, AdminRole, Child, Parent } from '@prisma/client';
export { Admin, AdminRole, Child, Parent };

export interface User {
  admin?: Admin;
  parent?: Parent;
  child?: Child;
}
