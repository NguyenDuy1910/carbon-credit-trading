import { Module } from '@nestjs/common';
import { CarbonEmissionController } from './carbon-emission.controller';

@Module({
  controllers: [CarbonEmissionController]
})
export class CarbonEmissionModule {}
