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
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CarbonProjectService } from './carbon-project.service';
import { CarbonProject } from './domain/carbon-project';
import { CreateCarbonProjectDto } from './dto/create-carbon-project.dto';
import { ProjectStatus } from './infrastructure/persistence/relational/enums/project-status.enum';

@ApiTags('CarbonProject')
@Controller({
  path: 'carbon-project',
  version: '1',
})
export class CarbonProjectController {
  constructor(private readonly carbonProjectService: CarbonProjectService) {}
  @Post()
  @ApiCreatedResponse({ type: CarbonProject })
  @ApiQuery({ name: 'projectStatus', enum: ProjectStatus })
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() createCarbonProjectDto: CreateCarbonProjectDto,
    @Query('projectStatus') projectStatus: ProjectStatus,
  ): Promise<CarbonProject> {
    const carbonProject = {
      ...createCarbonProjectDto,
      status: projectStatus || createCarbonProjectDto.status,
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
    return await this.carbonProjectService.findCarbonProjectById(id);
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
