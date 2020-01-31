import { PrismaClient } from '@prisma/client';

async function main(): Promise<void> {
  const prisma = new PrismaClient();
  //run prisma commands to seed
}

main().catch((e) => console.error(e));
