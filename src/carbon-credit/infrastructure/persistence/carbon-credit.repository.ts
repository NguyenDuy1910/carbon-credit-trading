import { NullableType } from '../../../utils/types/nullable.type';
import { CarbonCredit } from '../../domain/carbon-credit';
import { CarbonProject } from '../../../carbon-project/domain/carbon-project';

export abstract class CarbonCreditRepository {
  abstract create(
    carbonCredit: Omit<
      CarbonCredit,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    > & { project: CarbonProject },
  ): Promise<CarbonCredit>;

  abstract findById(
    id: CarbonCredit['id'],
  ): Promise<NullableType<CarbonCredit>>;

  abstract findByIds(ids: CarbonCredit['id'][]): Promise<CarbonCredit[]>;

  abstract remove(id: CarbonCredit['id']): Promise<void>;

  abstract findAll(): Promise<CarbonCredit[]>;

  abstract findByProjectId(
    projectId: CarbonProject['id'],
  ): Promise<CarbonCredit[]>;

  abstract updateCreditQuantity(
    id: CarbonCredit['id'],
    quantityUpdate: number,
  ): Promise<NullableType<CarbonCredit>>;
}
