import { createMap, createMapper, forMember, mapFrom } from '@automapper/core';
import { classes } from '@automapper/classes';
import { CarbonProject } from '../../../../domain/carbon-project';
import { CarbonProjectEntity } from '../entities/carbon-project.entity';
import { CarbonCreditMapper } from '../../../../../carbon-credit/infrastructure/persistence/relational/mapper/carbon-credit.mapper';

// Create and configure the mapper
export const mapper = createMapper({
  strategyInitializer: classes(),
});

// Define mappings between CarbonProject and CarbonProjectEntity
createMap(
  mapper,
  CarbonProject,
  CarbonProjectEntity,
  forMember(
    (destination) => destination.id,
    mapFrom((source) => source.id),
  ),
);
createMap(
  mapper,
  CarbonProjectEntity,
  CarbonProject,
  forMember(
    (destination) => destination.id,
    mapFrom((source) => source.id),
  ),
  forMember(
    (destination) => destination.carbonCredit,
    mapFrom((source) =>
      source.carbonCreditEntities?.map((creditEntity) =>
        CarbonCreditMapper.toDomain(creditEntity),
      ),
    ),
  ),
);

export class CarbonProjectMapper {
  static toDomain(raw: CarbonProjectEntity): CarbonProject {
    return mapper.map(raw, CarbonProjectEntity, CarbonProject);
  }

  static toPersistence(domainEntity: CarbonProject): CarbonProjectEntity {
    return mapper.map(domainEntity, CarbonProject, CarbonProjectEntity);
  }
}
