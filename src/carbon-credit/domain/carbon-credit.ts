import { Exclude } from 'class-transformer';
import { AutoMap } from '@automapper/classes';
import { Company } from '../../company/domain/company';
import { CreditStatus } from '../infrastructure/persistence/relational/enums/credit-status.enum';
import { CarbonProject } from '../../carbon-project/domain/carbon-project';

export class CarbonCredit {
  @Exclude({ toPlainOnly: true })
  @AutoMap()
  id: number;

  @AutoMap()
  serialNumber: string;

  @AutoMap()
  company: Company;

  @AutoMap()
  certificationStandard: string;

  @AutoMap()
  issuedAt: Date;

  @AutoMap()
  expirationAt: Date;

  @AutoMap()
  price: number;

  @AutoMap()
  status: CreditStatus;

  @AutoMap()
  creditAmount: number;

  @AutoMap()
  project: CarbonProject;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;

  @AutoMap()
  deletedAt: Date;
}
