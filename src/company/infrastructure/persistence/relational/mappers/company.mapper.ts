import { CompanyEntity } from '../entities/company.entity';
import { Company } from '../../../../domain/company';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { createMap, forMember, mapFrom } from '@automapper/core';
import { createMapper } from '@automapper/core';
import { classes } from '@automapper/classes';

// Create and export the mapper
export const mapper = createMapper({
  strategyInitializer: classes(),
});

// Map Company to CompanyEntity
createMap(
  mapper,
  Company,
  CompanyEntity,
  forMember(
    (destination) => destination.name,
    mapFrom((source) => source.companyName),
  ),
  forMember(
    (destination) => destination.address,
    mapFrom((source) => source.companyAddress),
  ),
  forMember(
    (destination) => destination.code,
    mapFrom((source) => source.companyCode),
  ),
  forMember(
    (destination) => destination.logo,
    mapFrom((source) =>
      source.logo ? FileMapper.toPersistence(source.logo) : null,
    ),
  ),
);

// Map CompanyEntity to Company
createMap(
  mapper,
  CompanyEntity,
  Company,
  forMember(
    (destination) => destination.companyName,
    mapFrom((source) => source.name),
  ),
  forMember(
    (destination) => destination.companyAddress,
    mapFrom((source) => source.address),
  ),
  forMember(
    (destination) => destination.companyCode,
    mapFrom((source) => source.code),
  ),

  forMember(
    (destination) => destination.logo,
    mapFrom((source) =>
      source.logo ? FileMapper.toDomain(source.logo) : null,
    ),
  ),
);

export class CompanyMapper {
  static toDomain(raw: CompanyEntity): Company {
    return mapper.map(raw, CompanyEntity, Company);
  }

  static toPersistence(domainEntity: Company): CompanyEntity {
    return mapper.map(domainEntity, Company, CompanyEntity);
  }
}
