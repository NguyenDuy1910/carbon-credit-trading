import { Permission } from '../../../../domain/permission';
import { PermissionEntity } from '../entities/permission.entity';

export class PermissionMapper {
  // Convert PermissionEntity to Permission domain object
  static toDomain(permissionEntity: PermissionEntity): Permission {
    const permission = new Permission();
    permission.id = permissionEntity.id;
    permission.enableAdd = permissionEntity.enableAdd;
    permission.enableEdit = permissionEntity.enableEdit;
    permission.enableDelete = permissionEntity.enableDelete;
    permission.enableView = permissionEntity.enableView;
    permission.userId = permissionEntity.userId?.id; // Assuming this is a string or number depending on your UserEntity
    return permission;
  }

  // Convert Permission domain object to PermissionEntity for database storage
  static toPersitence(permission: Permission): Partial<PermissionEntity> {
    const permissionEntity = new PermissionEntity();
    // const user = new User();
    permissionEntity.id = permission.id;
    // permissionEntity.enableAdd = permission.enableAdd;
    // permissionEntity.enableEdit = permission.enableEdit;
    // permissionEntity.enableDelete = permission.enableDelete;
    // permissionEntity.enableView = permission.enableView;
    // if (permission.userId) {
    //   user.id = permission.userId;
    // }
    // permissionEntity.userId = UserMapper.toPersistence(user); // Assuming you have userId in the Permission domain model
    return permissionEntity;
  }

  // Convert a list of PermissionEntities to Permission domain objects
  static toDomainList(permissionEntities: PermissionEntity[]): Permission[] {
    return permissionEntities.map(this.toDomain);
  }

  // Convert a list of Permissions to PermissionEntities
  // static toEntityList(permissions: Permission[]): Partial<PermissionEntity>[] {
  //     return permissions.map(this.toEntity);
  // }
}
