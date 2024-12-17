import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionEnum } from './permission.enum';
import { PermissionService } from './permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionEnum[]
    >('permissions', [context.getClass(), context.getHandler()]);

    const request = context.switchToHttp().getRequest();
    const userPermission = await this.permissionService.findByUserId(
      request.user.id,
    );
    const hasPermissions = requiredPermissions.every(
      (perm) => userPermission[perm] === true,
    );

    if (hasPermissions) {
      return true;
    }
    return false;
  }
}
