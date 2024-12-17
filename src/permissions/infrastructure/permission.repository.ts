import { NullableType } from '../../utils/types/nullable.type';
import { Permission } from '../domain/permission';
import { PermissionEntity } from './persistence/relational/entities/permission.entity';

export abstract class PermissionRepository {
  abstract create(data: Omit<Permission, 'id'>): Promise<Permission>;
  abstract findByUserId(
    userId: PermissionEntity['userId'],
  ): Promise<NullableType<Permission>>;

  //   abstract findManyWithPagination({
  //     filterOptions,
  //     sortOptions,
  //     paginationOptions,
  //   }: {
  //     filterOptions?: FilterPermissionDto | null;
  //     sortOptions?: SortPermissionDto[] | null;
  //     paginationOptions: IPaginationOptions;
  //   }): Promise<PermissionEntity[]>;

  //   abstract findById(id: PermissionEntity['id']): Promise<NullableType<PermissionEntity>>;
  //   abstract findByIds(ids: PermissionEntity['id'][]): Promise<PermissionEntity[]>;

  //   abstract findByUserId(userId: PermissionEntity['userId']): Promise<NullableType<PermissionEntity>>;

  //   abstract update(
  //     id: PermissionEntity['id'],
  //     payload: DeepPartial<PermissionEntity>,
  //   ): Promise<PermissionEntity | null>;

  //   abstract remove(id: PermissionEntity['id']): Promise<void>;
}
