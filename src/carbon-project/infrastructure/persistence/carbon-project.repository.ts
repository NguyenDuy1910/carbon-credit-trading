import { CarbonProject } from '../../domain/carbon-project';

export abstract class CarbonProjectRepository {
  abstract create(
    carbonProject: Omit<
      CarbonProject,
      'id' | 'createdAt' | 'updatedAt' | 'code'
    >,
  ): Promise<CarbonProject>;
  abstract updateById(id: CarbonProject['id']): Promise<void>;
  abstract deleteById(id: CarbonProject['id']): Promise<void>;
  abstract findById(id: CarbonProject['id']): Promise<CarbonProject>;
  abstract findAll(): Promise<CarbonProject[]>;
}
