import { Injectable, NotFoundException } from '@nestjs/common';
import { CarbonCreditRepository } from './infrastructure/persistence/carbon-credit.repository';
import { CreateCreditDto } from './dto/create-credit.dto';
import { CarbonCredit } from './domain/carbon-credit';
import { CompanyService } from '../company/company.service';
import { CarbonProjectService } from '../carbon-project/carbon-project.service';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class CarbonCreditService {
  constructor(
    private readonly carbonCreditRepository: CarbonCreditRepository,
    private readonly companyService: CompanyService,
    private readonly projectService: CarbonProjectService,
  ) {}
  async create(
    createCarbonCreditDto: CreateCreditDto,
    companyId: number,
    projectId: number,
  ): Promise<CarbonCredit> {
    // Fetch company and project entities
    const company = await this.companyService.findById(companyId);
    if (!company) {
      throw new Error(`Company with ID ${companyId} not found`);
    }

    const project = await this.projectService.findCarbonProjectById(projectId);
    if (!project) {
      throw new Error(`Carbon project with ID ${projectId} not found`);
    }
    const credit = {
      ...createCarbonCreditDto,
      company,
      project,
    };

    return this.carbonCreditRepository.create(credit);
  }
  async findById(id: CarbonCredit['id']): Promise<NullableType<CarbonCredit>> {
    const credit = await this.carbonCreditRepository.findById(id);
    if (!credit) {
      return null;
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
}
