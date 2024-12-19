import { CarbonProject } from '../../domain/carbon-project';
import { NullableType } from '../../../utils/types/nullable.type';

export abstract class CarbonProjectRepository {
  abstract create(
    carbonProject: Omit<
      CarbonProject,
      'id' | 'createdAt' | 'updatedAt' | 'carbonCredit'
    >,
  ): Promise<CarbonProject>;
  abstract updateById(id: CarbonProject['id']): Promise<void>;
  abstract deleteById(id: CarbonProject['id']): Promise<void>;
  abstract findById(id: CarbonProject['id']): Promise<CarbonProject>;
  abstract findAll(): Promise<CarbonProject[]>;
  abstract findByIdWithRelations(
    id: CarbonProject['id'],
  ): Promise<NullableType<CarbonProject>>;
}
