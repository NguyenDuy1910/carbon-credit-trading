import { Test, TestingModule } from '@nestjs/testing';
import { CarbonCreditController } from './carbon-credit.controller';

describe('CarbonCreditController', () => {
  let controller: CarbonCreditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarbonCreditController],
    }).compile();

    controller = module.get<CarbonCreditController>(CarbonCreditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
