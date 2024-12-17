import { Company } from '../../company/domain/company';
import { Exclude } from 'class-transformer';
import { AutoMap } from '@automapper/classes';
import { KycStatus } from '../infrastructure/persistence/relational/enums/kyc-status.enum';

export class CompanyKyc {
  @Exclude({ toPlainOnly: true })
  @AutoMap()
  id?: number;

  @AutoMap()
  documents: string;

  @AutoMap()
  company: Company;

  @AutoMap()
  file: string;

  @AutoMap()
  checkDay: Date;

  @AutoMap()
  notes: string;

  @AutoMap()
  status: KycStatus;

  @AutoMap()
  verifiedBy: string;

  @AutoMap()
  verifiedAt: Date;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;
}
