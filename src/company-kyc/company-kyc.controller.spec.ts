import { Test, TestingModule } from '@nestjs/testing';
import { CompanyKycController } from './company-kyc.controller';

describe('CompanyKycController', () => {
  let controller: CompanyKycController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyKycController],
    }).compile();

    controller = module.get<CompanyKycController>(CompanyKycController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
