import { NullableType } from '../../../utils/types/nullable.type';
import { Company } from '../../domain/company';

export abstract class CompanyRepository {
  abstract create(
    company: Omit<Company, 'id' | 'logo' | 'companyCode' | 'description'>,
  ): Promise<Company>;

  abstract findById(id: Company['id']): Promise<NullableType<Company>>;
  abstract findByIds(ids: Company['id'][]): Promise<Company[]>;
  abstract findByCompanyCode(
    companyCode: Company['companyCode'],
  ): Promise<NullableType<Company>>;
  //   abstract update(
  //     id: Company['id'],
  //     payload: DeepPartial<Company>,
  //   ): Promise<Company | null>;

  abstract remove(id: Company['id']): Promise<void>;
}
