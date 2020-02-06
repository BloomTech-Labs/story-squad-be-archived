import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { JWT } from '@models';
import { salt, secret } from '@environment';

const prisma = new PrismaClient();

export let parentJWT = '';
export let adminJWT = '';
export let childJWT = '';

export const connect = () => prisma.connect();
export const disconnect = () => prisma.disconnect();

export const seed = async () => {
  const { id: cohortID } = await prisma.cohort.create({
    data: {
      name: 'Seeded',
      activity: 'Reading',
      week: 1,
      dueDates: { create: { week: 1, reading: new Date(), submission: new Date() } },
    },
  });

  const { id: parentID } = await prisma.parent.create({
    data: {
      email: 'test@storysquad.com',
      password: await hash('testing1234', salt),
      stripeID: '',
    },
  });

  const parent: JWT = { parentID };
  parentJWT = sign(parent, secret);

  const { id: adminID } = await prisma.admin.create({
    data: {
      email: 'admin',
      password: await hash('password', salt),
      role: 'ADMIN',
    },
  });

  const admin: JWT = { adminID };
  adminJWT = sign(admin, secret);

  const { id: childID } = await prisma.child.create({
    data: {
      cohort: { connect: { id: cohortID } },
      parent: { connect: { id: parentID } },
      username: 'Dragon84',
      grade: 3,
    },
  });

  const child: JWT = { childID };
  adminJWT = sign(child, secret);
};

export const clean = async () => {
  await prisma.submission.deleteMany({ where: {} });
  await prisma.progress.deleteMany({ where: {} });
  await prisma.child.deleteMany({ where: {} });

  await prisma.dueDates.deleteMany({ where: {} });
  await prisma.cohort.deleteMany({ where: {} });

  await prisma.parent.deleteMany({ where: {} });

  await prisma.canon.deleteMany({ where: {} });
  await prisma.admin.deleteMany({ where: {} });
};
