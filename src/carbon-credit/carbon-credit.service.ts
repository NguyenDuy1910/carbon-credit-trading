import { Injectable, NotFoundException } from '@nestjs/common';
import { CarbonCreditRepository } from './infrastructure/persistence/carbon-credit.repository';
import { CreateCreditDto } from './dto/create-credit.dto';
import { CarbonCredit } from './domain/carbon-credit';
import { CompanyService } from '../company/company.service';
import { CarbonProjectService } from '../carbon-project/carbon-project.service';
import { NullableType } from '../utils/types/nullable.type';
import { CacheRedisService } from '../cache-redis/cache-redis.service';
import { CarbonProject } from '../carbon-project/domain/carbon-project';

@Injectable()
export class CarbonCreditService {
  private readonly redisPrefix = 'carbon_credit';
  constructor(
    private readonly carbonCreditRepository: CarbonCreditRepository,
    private readonly companyService: CompanyService,
    private readonly projectService: CarbonProjectService,
    private readonly redisService: CacheRedisService,
  ) {}
  async create(
    createCarbonCreditDto: CreateCreditDto,
    projectId: number,
  ): Promise<CarbonCredit> {
    const project = await this.projectService.findCarbonProjectById(projectId);
    if (!project) {
      throw new Error(`Carbon project with ID ${projectId} not found`);
    }
    const credit = {
      ...createCarbonCreditDto,
      project,
    };
    const carbonCredit = await this.carbonCreditRepository.create(credit);
    await this.setCarbonCredit(carbonCredit, projectId);

    return carbonCredit;
  }
  async setCarbonCredit(
    credit: CarbonCredit,
    projectId: number,
  ): Promise<void> {
    const redisKey = `${this.redisPrefix}:${projectId}`;

    const creditData = {
      year: credit.year,
      availableVolumeCredits: credit.availableVolumeCredits,
    };
    await this.redisService.set(redisKey, JSON.stringify(creditData), 3600);
  }

  async findById(id: CarbonCredit['id']): Promise<NullableType<CarbonCredit>> {
    const redisKey = `${this.redisPrefix}:${id}`;
    let credit: NullableType<CarbonCredit> =
      await this.redisService.get(redisKey);
    if (!credit) {
      // Fetch from database if not found in Redis
      credit = await this.carbonCreditRepository.findById(id);
      if (!credit) {
        return null; // Return null if not found in both Redis and database
      }
      await this.redisService.set(redisKey, credit);
    }

    return credit;
  }
  async findAll(): Promise<CarbonCredit[]> {
    return await this.carbonCreditRepository.findAll();
  }

  async findByIds(ids: CarbonCredit['id'][]): Promise<CarbonCredit[]> {
    return await this.carbonCreditRepository.findByIds(ids);
  }

  // REMOVE
  async remove(id: CarbonCredit['id']): Promise<void> {
    const credit = await this.findById(id);
    if (!credit) {
      throw new NotFoundException(`Carbon credit with ID ${id} not found`);
    }
    await this.carbonCreditRepository.remove(id);
  }
  async findByProjectId(
    projectId: CarbonProject['id'],
  ): Promise<CarbonCredit[]> {
    // const redisKey = `${this.redisPrefix}:${projectId}`;
    const credits =
      await this.carbonCreditRepository.findByProjectId(projectId);
    // await this.redisService.set(redisKey, JSON.stringify(credits));
    return credits;
  }
  async updateCreditQuantity(
    id: CarbonCredit['id'],
    quantityUpdate: number,
  ): Promise<NullableType<CarbonCredit>> {
    const updatedCredit =
      await this.carbonCreditRepository.updateCreditQuantity(
        id,
        quantityUpdate,
      );
    if (!updatedCredit) {
      throw new NotFoundException(`Carbon credit with ID ${id} not found`);
    }
    return updatedCredit;
  }
}
