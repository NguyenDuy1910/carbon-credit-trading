import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyKycRepository } from '../company_kyc.repository';
import { CompanyKycRelationalRepository } from './repositories/company_kyc.repository';
import { CompanyKycEntity } from './entities/company-kyc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyKycEntity])],
  providers: [
    {
      provide: CompanyKycRepository,
      useClass: CompanyKycRelationalRepository,
    },
  ],
  exports: [CompanyKycRepository],
})
export class RelationalCompanyKycPersistenceModule {}
