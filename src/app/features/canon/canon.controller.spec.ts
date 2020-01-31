import { Test } from '@nestjs/testing';

import { PrismaService } from '@shared/prisma';

import { CanonController } from './canon.controller';
import { CanonService } from './canon.service';
import { CanonDelegate, Child } from '@prisma/client';

describe('CanonController', () => {
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

  describe('getCanons()', () => {
    const canon1 = { week: 1, base64: 'base64', altbase64: 'altbase64' };
    const canon2 = { week: 2, base64: 'base64-2', altbase64: 'altbase64-2' };
    const result = [canon1, canon2];
    const findMany = jest.fn().mockResolvedValue(result);
    const mockCanonDelegate: Partial<CanonDelegate> = { findMany };

    beforeEach(() => {
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
    let findOne: jest.Mock;
    const childDetails: Child = {
      id: 1,
      grade: 3,
      username: 'Dragon45',
      subscription: '',
      dyslexia: false,
    };

    beforeEach(() => {
      const result = { week: 1, base64: 'base64', altbase64: 'altbase64' };
      findOne = jest.fn().mockResolvedValue(result);
      const mockCanonDelegate: Partial<CanonDelegate> = { findOne };
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

    it('should fail if the cannon is not found', async () => {
      findOne.mockResolvedValueOnce(false);
      await expect(canonController.getCanon({}, 1, '')).rejects.toBeInstanceOf(Error);
    });
  });

  describe('createCanon()', () => {
    let upsert: jest.Mock;

    beforeEach(() => {
      upsert = jest.fn().mockImplementation(async ({ create }) => create);
      const mockCanonDelegate: Partial<CanonDelegate> = { upsert };
      jest.spyOn(prismaService, 'canon', 'get').mockReturnValue(mockCanonDelegate as CanonDelegate);
    });

    it('should return the created canon', async () => {
      const canon = { week: 1, base64: 'base64', altbase64: 'altbase64' };
      expect(await canonController.createCanon(canon)).toBe(canon);
    });
  });

  describe('updateCanon()', () => {
    let findOne: jest.Mock;
    let update: jest.Mock;

    beforeEach(() => {
      findOne = jest.fn().mockResolvedValue(true);
      update = jest.fn().mockImplementation(async ({ data }) => data);
      const mockCanonDelegate: Partial<CanonDelegate> = { findOne, update };
      jest.spyOn(prismaService, 'canon', 'get').mockReturnValue(mockCanonDelegate as CanonDelegate);
    });

    it('should return the updated canon', async () => {
      const canon = { week: 1, base64: 'base64', altbase64: 'altbase64' };
      expect(await canonController.updateCanon(1, canon)).toBe(canon);
    });

    it('should fail if the cannon is not found', async () => {
      findOne.mockResolvedValueOnce(false);
      const canon = { week: 1, base64: 'base64', altbase64: 'altbase64' };
      await expect(canonController.updateCanon(1, canon)).rejects.toBeInstanceOf(Error);
    });
  });

  describe('delete()', () => {
    let findOne: jest.Mock;
    let remove: jest.Mock;

    beforeEach(() => {
      findOne = jest.fn().mockResolvedValue(true);
      remove = jest.fn();
      const mockCanonDelegate: Partial<CanonDelegate> = { findOne, delete: remove };
      jest.spyOn(prismaService, 'canon', 'get').mockReturnValue(mockCanonDelegate as CanonDelegate);
    });

    it('should attempt to delete the canon cannon of a given week', async () => {
      expect(await canonController.deleteCanon(1)).toBeTruthy();
      expect(remove).toHaveBeenCalled();
      expect(remove).toHaveBeenCalledWith({ where: { week: 1 } });
    });

    it('should fail if the cannon is not found', async () => {
      findOne.mockResolvedValueOnce(false);
      await expect(canonController.deleteCanon(1)).rejects.toBeInstanceOf(Error);
      expect(remove).not.toHaveBeenCalled();
    });
  });
});
