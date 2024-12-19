import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CarbonProjectService } from './carbon-project.service';
import { CarbonProject } from './domain/carbon-project';
import { CreateCarbonProjectDto } from './dto/create-carbon-project.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { CarbonProjectType } from './infrastructure/persistence/relational/enums/project-status.enum';

@ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'), RolesGuard)
// @Roles(RoleEnum.project_developer)
@ApiTags('CarbonProject')
@Controller({
  path: 'carbon-project',
  version: '1',
})
export class CarbonProjectController {
  constructor(private readonly carbonProjectService: CarbonProjectService) {}
  @Post()
  @Roles(RoleEnum.project_developer, RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiCreatedResponse({ type: CarbonProject })
  @ApiQuery({ name: 'type', enum: CarbonProjectType })
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() createCarbonProjectDto: CreateCarbonProjectDto,
    @Query('type') carbonProjectType: CarbonProjectType,
  ): Promise<CarbonProject> {
    const carbonProject = {
      ...createCarbonProjectDto,
      type: carbonProjectType || createCarbonProjectDto.type,
    };
    return this.carbonProjectService.create(carbonProject);
  }
  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieve a Carbon Credit by ID',
    type: CarbonProject,
  })
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CarbonProject | null> {
    return await this.carbonProjectService.findProjectByIdWithRelations(id);
  }
  @Get()
  @ApiOkResponse({
    type: [CarbonProject],
    description: 'Retrieve all Carbon Credits',
  })
  public async findAll(): Promise<CarbonProject[]> {
    return await this.carbonProjectService.findAll();
  }
}
