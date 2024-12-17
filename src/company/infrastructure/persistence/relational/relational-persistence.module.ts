import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity';
import { CompanyRepository } from '../company.repository';
import { CompanyRelationalRepository } from './repositories/company.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity])],
  providers: [
    {
      provide: CompanyRepository,
      useClass: CompanyRelationalRepository,
    },
  ],
  exports: [CompanyRepository],
})
export class RelationalCompanyPersistenceModule {}
