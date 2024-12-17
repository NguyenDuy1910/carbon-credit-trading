import { NullableType } from '../../../utils/types/nullable.type';
import { CarbonCredit } from '../../domain/carbon-credit';

export abstract class CarbonCreditRepository {
  abstract create(
    company: Omit<CarbonCredit, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<CarbonCredit>;

  abstract findById(
    id: CarbonCredit['id'],
  ): Promise<NullableType<CarbonCredit>>;
  abstract findByIds(ids: CarbonCredit['id'][]): Promise<CarbonCredit[]>;

  abstract remove(id: CarbonCredit['id']): Promise<void>;
  abstract findAll(): Promise<CarbonCredit[]>;
}
