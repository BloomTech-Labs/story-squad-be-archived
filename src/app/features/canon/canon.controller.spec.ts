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

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CanonController],
      providers: [CanonService, PrismaService],
    }).compile();

    canonController = moduleRef.get<CanonController>(CanonController);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  describe('getCanons()', () => {
    const canon1 = { week: 1, base64: 'base64', altbase64: 'altbase64' };
    const canon2 = { week: 2, base64: 'base64-2', altbase64: 'altbase64-2' };
    const result = [canon1, canon2];
    const findMany = jest.fn().mockResolvedValue(result);
    const mockCanonDelegate: Partial<CanonDelegate> = { findMany };

    beforeAll(() => {
      jest.spyOn(prismaService, 'canon', 'get').mockReturnValue(mockCanonDelegate as CanonDelegate);
    });

    it('should return all items from the database', async () => {
      const response = await canonController.getCanons();
      expect(response).toHaveLength(2);
      expect(response[0].week).toBe(1);
      expect(response[1].week).toBe(2);
    });
  });

  describe('getCanon()', () => {
    const result = { week: 1, base64: 'base64', altbase64: 'altbase64' };
    const findOne = jest.fn().mockResolvedValue(result);
    const mockCanonDelegate: Partial<CanonDelegate> = { findOne };

    beforeAll(() => {
      jest.spyOn(prismaService, 'canon', 'get').mockReturnValue(mockCanonDelegate as CanonDelegate);
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

    it('should use the dyslexia query param above all else', async () => {
      const regularChild: Child = { ...childDetails, dyslexia: false };
      const dyslexicChild: Child = { ...childDetails, dyslexia: true };
      expect(await canonController.getCanon({}, 1, 'force')).toBe('altbase64');
      expect(await canonController.getCanon({}, 1, 'force')).toBe('altbase64');
      expect(await canonController.getCanon({ child: regularChild }, 1, 'force')).toBe('altbase64');
      expect(await canonController.getCanon({ child: dyslexicChild }, 1, 'force')).toBe('altbase64');
    });

    it('should only deliver the dyslexic version when the dyslexia query param is set to force', async () => {
      expect(await canonController.getCanon({}, 1, 'something-else')).toBe('base64');
      expect(await canonController.getCanon({}, 1, 'force')).toBe('altbase64');
    });
  });

  describe('createCanon()', () => {
    const upsert = jest.fn().mockImplementation(async ({ create }) => create);
    const mockCanonDelegate: Partial<CanonDelegate> = { upsert };

    beforeAll(() => {
      jest.spyOn(prismaService, 'canon', 'get').mockReturnValue(mockCanonDelegate as CanonDelegate);
    });

    it('should return the created canon', async () => {
      const canon = { week: 1, base64: 'base64', altbase64: 'altbase64' };
      expect(await canonController.createCanon(canon)).toBe(canon);
    });
  });

  describe('updateCanon()', () => {
    const findOne = jest.fn().mockResolvedValue(true);
    const update = jest.fn().mockImplementation(async ({ data }) => data);
    const mockCanonDelegate: Partial<CanonDelegate> = { findOne, update };

    beforeAll(() => {
      jest.spyOn(prismaService, 'canon', 'get').mockReturnValue(mockCanonDelegate as CanonDelegate);
    });

    it('should return the updated canon', async () => {
      const canon = { week: 1, base64: 'base64', altbase64: 'altbase64' };
      expect(await canonController.updateCanon(1, canon)).toBe(canon);
    });
  });

  describe('delete()', () => {
    const findOne = jest.fn().mockResolvedValue(true);
    const mockCanonDelegate: Partial<CanonDelegate> = { findOne, delete: jest.fn() };

    beforeAll(() => {
      jest.spyOn(prismaService, 'canon', 'get').mockReturnValue(mockCanonDelegate as CanonDelegate);
    });

    it('should return the updated canon', async () => {
      expect(await canonController.deleteCanon(1)).toBeTruthy();
      expect(mockCanonDelegate.delete).toHaveBeenCalled();
    });
  });
});
