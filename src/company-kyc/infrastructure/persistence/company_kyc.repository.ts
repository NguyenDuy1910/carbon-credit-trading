import { NullableType } from '../../../utils/types/nullable.type';
import { CompanyKyc } from '../../domain/company-kyc';

export abstract class CompanyKycRepository {
  abstract create(
    companyKyc: Omit<CompanyKyc, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CompanyKyc>;

  abstract findById(id: CompanyKyc['id']): Promise<NullableType<CompanyKyc>>;
  abstract findByIds(ids: CompanyKyc['id'][]): Promise<CompanyKyc[]>;

  abstract remove(id: CompanyKyc['id']): Promise<void>;
  abstract findByStatus(status: CompanyKyc['status']): Promise<CompanyKyc[]>;
  abstract findByCheckDayRange(
    startDate: Date,
    endDate: Date,
  ): Promise<CompanyKyc[]>;
  abstract update(
    id: CompanyKyc['id'],
    updates: Partial<Omit<CompanyKyc, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<CompanyKyc>;
}
