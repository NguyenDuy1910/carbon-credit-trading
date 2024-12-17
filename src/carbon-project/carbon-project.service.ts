import { Injectable } from '@nestjs/common';
import { CarbonProjectRepository } from './infrastructure/persistence/carbon-project.repository';
import { CarbonProject } from './domain/carbon-project';
import { CreateCarbonProjectDto } from './dto/create-carbon-project.dto';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class CarbonProjectService {
  constructor(
    private readonly carbonProjectRepository: CarbonProjectRepository,
  ) {}

  async create(
    createCarbonProjectDto: CreateCarbonProjectDto,
  ): Promise<CarbonProject> {
    return await this.carbonProjectRepository.create({
      ...createCarbonProjectDto,
    });
  }

  async findCarbonProjectById(
    id: number,
  ): Promise<NullableType<CarbonProject>> {
    const carbonProject = this.carbonProjectRepository.findById(id);
    if (!carbonProject) return null;
    return carbonProject;
  }
  async findAll(): Promise<CarbonProject[]> {
    return await this.carbonProjectRepository.findAll();
  }
}
