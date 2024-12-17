import { Module } from '@nestjs/common';
import { CarbonProjectController } from './carbon-project.controller';
import { RelationalCarbonProjectPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { CarbonProjectService } from './carbon-project.service';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    CarbonProjectModule,
    CompanyModule,
    RelationalCarbonProjectPersistenceModule,
  ],
  controllers: [CarbonProjectController],
  providers: [CarbonProjectService],
  exports: [CarbonProjectService],
})
export class CarbonProjectModule {}
