import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarbonProjectEntity } from './entities/carbon-project.entity';
import { CarbonProjectRepository } from '../carbon-project.repository';
import { CarbonProjectRelationalRepository } from './repositories/carbon-project.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CarbonProjectEntity])],
  providers: [
    {
      provide: CarbonProjectRepository,
      useClass: CarbonProjectRelationalRepository,
    },
  ],
  exports: [CarbonProjectRepository],
})
export class RelationalCarbonProjectPersistenceModule {}
