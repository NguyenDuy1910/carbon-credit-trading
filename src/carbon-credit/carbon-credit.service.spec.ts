import { Test, TestingModule } from '@nestjs/testing';
import { CarbonCreditService } from './carbon-credit.service';

describe('CarbonCreditService', () => {
  let service: CarbonCreditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarbonCreditService],
    }).compile();

    service = module.get<CarbonCreditService>(CarbonCreditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
