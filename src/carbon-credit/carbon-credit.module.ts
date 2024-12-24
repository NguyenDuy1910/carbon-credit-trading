import { Module } from '@nestjs/common';
import { CarbonCreditService } from './carbon-credit.service';
import { CarbonCreditController } from './carbon-credit.controller';
import { RelationalCarbonCreditPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { CompanyModule } from '../company/company.module';
import { CarbonProjectModule } from '../carbon-project/carbon-project.module';
import { CacheRedisModule } from '../cache-redis/cache-redis.module';

@Module({
  imports: [
    CacheRedisModule,
    CarbonCreditModule,
    CarbonProjectModule,
    CompanyModule,
    RelationalCarbonCreditPersistenceModule,
  ],
  providers: [CarbonCreditService],
  controllers: [CarbonCreditController],
  exports: [CarbonCreditService],
})
export class CarbonCreditModule {}
