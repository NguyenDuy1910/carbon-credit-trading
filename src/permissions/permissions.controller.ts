import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { PermissionService } from './permissions.service';
import { Permission } from './domain/permission';
import { CreatePermissionDto } from './dto/create-permission.dto';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Permissions')
@Controller({
  path: 'permissions',
  version: '1',
})
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiCreatedResponse({
    type: Permission,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionService.createPermission(createPermissionDto);
  }

  // @Get()
  // async findAll(): Promise<PermissionEntity[]> {
  //     return this.permissionService.findAll();
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: number): Promise<PermissionEntity> {
  //     return this.permissionService.findOne(id);
  // }

  // @Put(':id')
  // async update(@Param('id') id: number, @Body() updatePermissionDto: UpdatePermissionDto): Promise<PermissionEntity> {
  //     return this.permissionService.update(id, updatePermissionDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: number): Promise<void> {
  //     return this.permissionService.remove(id);
  // }
}
