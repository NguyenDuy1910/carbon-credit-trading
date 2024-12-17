import { Injectable } from '@nestjs/common';
import { PermissionRepository } from './infrastructure/permission.repository';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './domain/permission';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionRepository.create({
      userId: createPermissionDto.userId,
      enableAdd: createPermissionDto.enableAdd,
      enableEdit: createPermissionDto.enableEdit,
      enableDelete: createPermissionDto.enableDelete,
      enableView: createPermissionDto.enableView,
    });
  }
  async findByUserId(userId: number): Promise<Permission> {
    const user = new UserEntity();
    user.id = userId;
    const permission = await this.permissionRepository.findByUserId(user);

    if (!permission) {
      throw new Error(`No permissions found for user ID ${userId}`);
    }
    return permission;
  }

  // async findAll(): Promise<PermissionEntity[]> {
  //     return this.permissionRepository.find();
  // }

  // async findOne(id: number): Promise<PermissionEntity> {
  //     return this.permissionRepository.findOne(id);
  // }

  // async update(id: number, data: Partial<PermissionEntity>): Promise<PermissionEntity> {
  //     await this.permissionRepository.update(id, data);
  //     return this.permissionRepository.findOne(id);
  // }

  // async remove(id: number): Promise<void> {
  //     await this.permissionRepository.delete(id);
  // }
}
