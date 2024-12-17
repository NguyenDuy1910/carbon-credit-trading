import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from './roles.enum';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly companyService: CompanyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<(number | string)[]>(
      'roles',
      [context.getClass(), context.getHandler()],
    );

    if (!roles.length) {
      return true; // Allow access if no roles are defined
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Allow access for admin role
    const userRoleId = Number(user?.role?.id);
    if (userRoleId === RoleEnum.admin) {
      return true;
    }

    // Check if the user has a valid role
    if (![RoleEnum.admin_company].includes(userRoleId)) {
      return false;
    }

    const companyId = user?.companyId;
    if (!companyId) {
      return false;
    }

    const companyIdFromParam = Number(request.params.id);
    const company = await this.companyService.findById(companyIdFromParam);

    // Validate company access
    if (!company || company.id !== companyId) {
      return false;
    }

    return true; // User has access
  }
}
