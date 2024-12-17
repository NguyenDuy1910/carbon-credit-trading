import { Module } from '@nestjs/common';
import { CompanyKycService } from './company-kyc.service';
import { CompanyKycController } from './company-kyc.controller';
import { CompanyModule } from '../company/company.module';
import { RelationalCompanyKycPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { FilesLocalModule } from '../files/infrastructure/uploader/local/files.module';

@Module({
  imports: [
    CompanyModule,
    FilesLocalModule,
    RelationalCompanyKycPersistenceModule,
  ],
  controllers: [CompanyKycController],
  providers: [CompanyKycService],
  exports: [CompanyKycService],
})
export class CompanyKycModule {}
