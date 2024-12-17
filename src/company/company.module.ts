import { Module } from '@nestjs/common';

import { DatabaseConfig } from '../database/config/database-config.type';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { RelationalCompanyPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DocumentCompanyPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { UsersModule } from '../users/users.module';

// <database-block>
const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentCompanyPersistenceModule
  : RelationalCompanyPersistenceModule;
// </database-block>

@Module({
  imports: [UsersModule, infrastructurePersistenceModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
