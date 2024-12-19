import { Test, TestingModule } from '@nestjs/testing';
import { CarbonEmissionController } from './carbon-emission.controller';

describe('CarbonEmissionController', () => {
  let controller: CarbonEmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarbonEmissionController],
    }).compile();

    controller = module.get<CarbonEmissionController>(CarbonEmissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
