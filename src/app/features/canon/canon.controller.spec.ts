import { Test } from '@nestjs/testing';

import { PrismaService } from '@shared/prisma';

import { CanonController } from './canon.controller';
import { CanonService } from './canon.service';
import { CanonDelegate } from '@prisma/client';

describe('CatsController', () => {
  let canonController: CanonController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CanonController],
      providers: [CanonService, PrismaService],
    }).compile();

    canonController = moduleRef.get<CanonController>(CanonController);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  describe('getCanon()', () => {
    it('should return the cannon for the requested week', async () => {
      const result = { week: 1, base64: 'abc', altbase64: 'def' };
      const findOne = jest.fn().mockResolvedValue(result);
      const mockedPrisma: Partial<CanonDelegate> = { findOne };

      jest.spyOn(prismaService, 'canon', 'get').mockReturnValue(mockedPrisma as CanonDelegate);
      expect(await canonController.getCanon({}, 1, '')).toBe(result.base64);
    });
  });
});
