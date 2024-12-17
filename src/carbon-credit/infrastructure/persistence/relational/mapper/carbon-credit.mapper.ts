import { createMap, createMapper, forMember, mapFrom } from '@automapper/core';
import { classes } from '@automapper/classes';
import { CarbonCredit } from '../../../../domain/carbon-credit';
import { CarbonCreditEntity } from '../entities/carbon-credit.entity';
import { CompanyMapper } from '../../../../../company/infrastructure/persistence/relational/mappers/company.mapper';
import { CarbonProjectMapper } from '../../../../../carbon-project/infrastructure/persistence/relational/mapper/carbon-project.mapper';

// Initialize the mapper
export const mapper = createMapper({
  strategyInitializer: classes(),
});
// Map from CarbonCredit to CarbonCreditEntity
createMap(
  mapper,
  CarbonCredit,
  CarbonCreditEntity,

  forMember(
    (destination) => destination.company,
    mapFrom((source) => CompanyMapper.toPersistence(source.company)),
  ),
  forMember(
    (destination) => destination.project,
    mapFrom((source) => CarbonProjectMapper.toPersistence(source.project)),
  ),
);

// Map from CarbonCreditEntity to CarbonCredit
createMap(
  mapper,
  CarbonCreditEntity,
  CarbonCredit,
  forMember(
    (destination) => destination.company,
    mapFrom((source) => CompanyMapper.toDomain(source.company)),
  ),
  forMember(
    (destination) => destination.project,
    mapFrom((source) => CarbonProjectMapper.toDomain(source.project)),
  ),
);

export class CarbonCreditMapper {
  static toDomain(raw: CarbonCreditEntity): CarbonCredit {
    return mapper.map(raw, CarbonCreditEntity, CarbonCredit);
  }

  static toPersistence(raw: CarbonCredit): CarbonCreditEntity {
    return mapper.map(raw, CarbonCredit, CarbonCreditEntity);
  }
}
