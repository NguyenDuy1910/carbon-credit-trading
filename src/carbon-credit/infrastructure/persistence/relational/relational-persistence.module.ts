import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarbonCreditEntity } from './entities/carbon-credit.entity';
import { CarbonCreditRepository } from '../carbon-credit.repository';
import { CarbonCreditRelationalRepository } from './repositories/carbon-credit.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CarbonCreditEntity])],
  providers: [
    {
      provide: CarbonCreditRepository,
      useClass: CarbonCreditRelationalRepository,
    },
  ],
  exports: [CarbonCreditRepository],
})
export class RelationalCarbonCreditPersistenceModule {}
