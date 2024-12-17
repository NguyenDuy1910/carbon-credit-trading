import { Test, TestingModule } from '@nestjs/testing';
import { CompanyKycService } from './company-kyc.service';

describe('CompanyKycService', () => {
  let service: CompanyKycService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyKycService],
    }).compile();

    service = module.get<CompanyKycService>(CompanyKycService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
