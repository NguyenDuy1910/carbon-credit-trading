import { createMap, createMapper } from '@automapper/core';
import { classes } from '@automapper/classes';
import { CompanyKycEntity } from '../entities/company-kyc.entity';
import { CompanyKyc } from '../../../../domain/company-kyc';

export const mapper = createMapper({
  strategyInitializer: classes(),
});

createMap(mapper, CompanyKyc, CompanyKycEntity);
createMap(mapper, CompanyKycEntity, CompanyKyc);
export class CompanyKycMapper {
  static toDomain(raw: CompanyKycEntity): CompanyKyc {
    return mapper.map(raw, CompanyKycEntity, CompanyKyc);
  }

  static toPersistence(domainEntity: CompanyKyc): CompanyKycEntity {
    return mapper.map(domainEntity, CompanyKyc, CompanyKycEntity);
  }
}
