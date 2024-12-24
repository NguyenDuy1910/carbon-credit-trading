import { Injectable } from '@nestjs/common';
import { CarbonProjectRepository } from './infrastructure/persistence/carbon-project.repository';
import { CarbonProject } from './domain/carbon-project';
import { CreateCarbonProjectDto } from './dto/create-carbon-project.dto';
import { NullableType } from '../utils/types/nullable.type';
import { CacheRedisService } from '../cache-redis/cache-redis.service';

@Injectable()
export class CarbonProjectService {
  private readonly CACHE_TTL = 60000; // Cache time-to-live in seconds

  constructor(
    private readonly carbonProjectRepository: CarbonProjectRepository,
    private readonly cacheRedis: CacheRedisService,
  ) {}

  async create(
    createCarbonProjectDto: CreateCarbonProjectDto,
  ): Promise<CarbonProject> {
    return this.carbonProjectRepository.create(createCarbonProjectDto);
  }

  async findCarbonProjectById(
    id: number,
  ): Promise<NullableType<CarbonProject>> {
    const carbonProject = await this.carbonProjectRepository.findById(id);
    return carbonProject || null;
  }

  async findProjectByIdWithRelations(
    id: number,
  ): Promise<NullableType<CarbonProject>> {
    const cacheKey = `carbon-project:${id}`;

    const cachedProject = await this.cacheRedis.get<CarbonProject>(cacheKey);
    if (cachedProject) {
      return cachedProject;
    }

    // Fetch from database if not cached
    const carbonProject =
      await this.carbonProjectRepository.findByIdWithRelations(id);
    if (!carbonProject) {
      return null;
    }

    await this.cacheRedis.set(cacheKey, carbonProject, this.CACHE_TTL);

    return carbonProject;
  }

  async findAll(): Promise<CarbonProject[]> {
    return this.carbonProjectRepository.findAll();
  }
}
