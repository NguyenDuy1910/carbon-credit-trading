import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { RoleEntity } from '../../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { StatusEntity } from '../../../../../statuses/infrastructure/persistence/relational/entities/status.entity';
import { User } from '../../../../domain/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const domainUser = new User();
    domainUser.id = raw.id;
    domainUser.email = raw.email ?? null;
    domainUser.authProvider = raw.authProvider;
    domainUser.socialId = raw.socialId ?? null;
    domainUser.firstName = raw.firstName ?? null;
    domainUser.lastName = raw.lastName ?? null;
    domainUser.photo = raw.profilePicture
      ? FileMapper.toDomain(raw.profilePicture)
      : null;
    domainUser.role = raw.userRole ?? null;
    domainUser.status = raw.userStatus; // Sửa lỗi gán cho status
    domainUser.createdAt = raw.createdAt;
    domainUser.updatedAt = raw.updatedAt;
    domainUser.deletedAt = raw.deletedAt;
    domainUser.password = raw.password;

    // Return the full domain entity, optionally sanitizing if needed
    return domainUser;
  }

  static toPersistence(domainEntity: User): UserEntity {
    // Handle RoleEntity mapping
    let role: RoleEntity | null = null;
    if (domainEntity.role) {
      role = new RoleEntity();
      role.id = Number(domainEntity.role.id);
    }

    // Handle FileEntity (photo) mapping
    let photo: FileEntity | null = null;
    if (domainEntity.photo) {
      photo = new FileEntity();
      photo.id = domainEntity.photo.id;
      photo.path = domainEntity.photo.path;
    } else if (domainEntity.photo === null) {
      photo = null;
    }

    // Handle StatusEntity mapping
    let status: StatusEntity | undefined = undefined;

    if (domainEntity.status) {
      status = new StatusEntity();
      status.id = Number(domainEntity.status.id);
    }
    const persistenceEntity = new UserEntity();

    if (domainEntity.id && typeof domainEntity.id === 'number') {
      persistenceEntity.id = domainEntity.id;
    }

    // Map remaining fields
    persistenceEntity.email = domainEntity.email;
    persistenceEntity.password = domainEntity.password; // Handle sensitive field properly
    persistenceEntity.authProvider = domainEntity.authProvider;
    persistenceEntity.socialId = domainEntity.socialId;
    persistenceEntity.firstName = domainEntity.firstName;
    persistenceEntity.lastName = domainEntity.lastName;
    persistenceEntity.profilePicture = photo;
    persistenceEntity.userRole = role;
    persistenceEntity.userStatus = status;

    // Timestamps
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;

    return persistenceEntity;
  }
}
