import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from '../entities/permission.entity';
import { PermissionRepository } from '../../../permission.repository';
import { Repository } from 'typeorm';
import { Permission } from '../../../../domain/permission';
import { PermissionMapper } from '../mapper/permission.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';

@Injectable()
export class PermissionRelationalRepository implements PermissionRepository {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}
  async create(data: Permission): Promise<Permission> {
    const persistenceModel = PermissionMapper.toPersitence(data);
    const newEntity = await this.permissionRepository.save(
      this.permissionRepository.create(persistenceModel),
    );
    return PermissionMapper.toDomain(newEntity);
  }
  async findByUserId(
    userId: PermissionEntity['userId'],
  ): Promise<NullableType<Permission>> {
    const permission = await this.permissionRepository.findOne({
      where: { userId },
    });
    if (!permission) {
      throw new Error(`Permission not found for userId: ${userId}`);
    }
    return PermissionMapper.toDomain(permission);
  }
}
