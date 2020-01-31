import { Test } from '@nestjs/testing';

import { PrismaService } from '@shared/prisma';

import { CanonController } from './canon.controller';
import { CanonService } from './canon.service';
import { CanonDelegate, Child } from '@prisma/client';

describe('CanonController', () => {
  let canonController: CanonController;
  let prismaService: PrismaService;
  const childDetails: Child = {
    id: 1,
    grade: 3,
    username: 'Dragon45',
    subscription: '',
    dyslexia: false,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CanonController],
      providers: [CanonService, PrismaService],
    }).compile();

    canonController = moduleRef.get<CanonController>(CanonController);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  describe('getCanon()', () => {
    beforeEach(() => {
      const result = { week: 1, base64: 'base64', altbase64: 'altbase64' };
      const findOne = jest.fn().mockResolvedValue(result);
      const mockedPrisma: Partial<CanonDelegate> = { findOne };
      jest.spyOn(prismaService, 'canon', 'get').mockReturnValue(mockedPrisma as CanonDelegate);
    });

    it('should return the base64 cannon by default', async () => {
      expect(await canonController.getCanon({}, 1, '')).toBe('base64');
    });

    it('should use child preferences when available', async () => {
      const regularChild: Child = { ...childDetails, dyslexia: false };
      const dyslexicChild: Child = { ...childDetails, dyslexia: true };
      expect(await canonController.getCanon({ child: regularChild }, 1, '')).toBe('base64');
      expect(await canonController.getCanon({ child: dyslexicChild }, 1, '')).toBe('altbase64');
    });
  });
});
