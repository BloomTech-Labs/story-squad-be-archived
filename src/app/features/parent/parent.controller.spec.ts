import { Test } from '@nestjs/testing';

import { ParentController } from './parent.controller';

describe('ParentController', () => {
  let parentController: ParentController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ParentController],
    }).compile();

    parentController = moduleRef.get<ParentController>(ParentController);
  });

  describe('whoAmI()', () => {
    const parent = { id: 1, email: 'test@email.com', password: 'HIDDEN', stripeID: 'cus_123' };

    it('should return the users email and ID', async () => {
      const response = await parentController.whoAmI(parent);
      expect(response.id).toBe(1);
      expect(response.email).toBe('test@email.com');
    });

    it('should not return the password', async () => {
      const response = await parentController.whoAmI(parent);
      expect((response as any).password).toBe(undefined);
    });
  });
});
