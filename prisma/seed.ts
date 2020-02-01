import { PrismaClient } from '@prisma/client';

const seed = async () => {
  const prisma = new PrismaClient();
  //run prisma commands to seed
};

seed().catch((e) => console.error(e));
