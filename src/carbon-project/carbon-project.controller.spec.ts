import { Test, TestingModule } from '@nestjs/testing';
import { CarbonProjectController } from './carbon-project.controller';

describe('CarbonProjectController', () => {
  let controller: CarbonProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarbonProjectController],
    }).compile();

    controller = module.get<CarbonProjectController>(CarbonProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
