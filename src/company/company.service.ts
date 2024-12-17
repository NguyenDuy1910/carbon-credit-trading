import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from './infrastructure/persistence/company.repository';
import { Company } from './domain/company';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = await this.companyRepository.create({
      companyName: createCompanyDto.companyName,
      companyType: createCompanyDto.companyType,
      companyAddress: createCompanyDto.companyAddress,
      email: createCompanyDto.email,
      postalCode: createCompanyDto.postalCode,
      website: createCompanyDto.website,
      registerNumber: createCompanyDto.registerNumber,
      representativeName: createCompanyDto.representativeName,
      location: createCompanyDto.location,
    });
    return company;
  }

  async findByCompanyCode(companyCode: string): Promise<Company> {
    const company = await this.companyRepository.findByCompanyCode(companyCode);
    if (!company) {
      throw new NotFoundException(
        `Company with companyCode ${companyCode} not found`,
      );
    }
    return company;
  }

  async findById(id: Company['id']): Promise<Company> {
    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }
  async findByIds(ids: Company['id'][]): Promise<Company[]> {
    return await this.companyRepository.findByIds(ids);
  }
}
