import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CompanyEntity } from '../entities/company.entity'; // Adjust the path accordingly
import { Company } from '../../../../domain/company'; // Ensure this is the correct import path for your Company domain model
import { CompanyMapper } from '../mappers/company.mapper'; // Create a mapper for Company if necessary
import { NullableType } from '../../../../../utils/types/nullable.type';
import { CompanyRepository } from '../../company.repository';

@Injectable()
export class CompanyRelationalRepository implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async create(data: Company): Promise<Company> {
    const persistenceModel = CompanyMapper.toPersistence(data);

    const newEntity = await this.companyRepository.save(
      this.companyRepository.create(persistenceModel),
    );
    return CompanyMapper.toDomain(newEntity);
  }

  async findByCompanyCode(
    companyCode: Company['companyCode'],
  ): Promise<NullableType<Company>> {
    const entity = await this.companyRepository.findOne({
      where: { code: String(companyCode) },
    });

    return entity ? CompanyMapper.toDomain(entity) : null;
  }
  async findById(id: Company['id']): Promise<NullableType<Company>> {
    const company = await this.companyRepository.findOne({
      where: { id: Number(id) },
    });
    return company ? CompanyMapper.toDomain(company) : null;
  }
  async findByIds(ids: Company['id'][]): Promise<Company[]> {
    const entities = await this.companyRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((company) => CompanyMapper.toDomain(company));
  }

  async findAll(): Promise<Company[]> {
    const entities = await this.companyRepository.find({
      relations: ['users'], // Load related entities
    });

    return entities.map((company) => CompanyMapper.toDomain(company));
  }

  async remove(id: Company['id']): Promise<void> {
    if (!id) {
      return;
    }
    await this.companyRepository.softDelete(id);
  }
}
