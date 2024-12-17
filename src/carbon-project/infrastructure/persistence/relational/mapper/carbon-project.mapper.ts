import { createMap, createMapper } from '@automapper/core';
import { classes } from '@automapper/classes';
import { CarbonProject } from '../../../../domain/carbon-project';
import { CarbonProjectEntity } from '../entities/carbon-project.entity';

// Create and configure the mapper
export const mapper = createMapper({
  strategyInitializer: classes(),
});

// Define mappings between CarbonProject and CarbonProjectEntity
createMap(mapper, CarbonProject, CarbonProjectEntity);
createMap(mapper, CarbonProjectEntity, CarbonProject);

export class CarbonProjectMapper {
  static toDomain(raw: CarbonProjectEntity): CarbonProject {
    return mapper.map(raw, CarbonProjectEntity, CarbonProject);
  }

  static toPersistence(domainEntity: CarbonProject): CarbonProjectEntity {
    return mapper.map(domainEntity, CarbonProject, CarbonProjectEntity);
  }
}
