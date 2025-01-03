import { Injectable } from '@nestjs/common';
import { CompanyKyc } from '../../../../domain/company-kyc';
import { CompanyKycEntity } from '../entities/company-kyc.entity';
import { CompanyKycRepository } from '../../company_kyc.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { CompanyKycMapper } from '../mappers/company-kyc.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';

@Injectable()
export class CompanyKycRelationalRepository implements CompanyKycRepository {
  constructor(
    @InjectRepository(CompanyKycEntity)
    private readonly companyKycRepository: Repository<CompanyKycEntity>,
  ) {}

  async create(data: CompanyKyc): Promise<CompanyKyc> {
    const persistenceModel = CompanyKycMapper.toPersistence(data);

    const newEntity = await this.companyKycRepository.save(
      this.companyKycRepository.create(persistenceModel),
    );
    return CompanyKycMapper.toDomain(newEntity);
  }

  async findById(id: CompanyKyc['id']): Promise<NullableType<CompanyKyc>> {
    const company = await this.companyKycRepository.findOne({
      where: { id: Number(id) },
    });
    return company ? CompanyKycMapper.toDomain(company) : null;
  }
  async findByIds(ids: CompanyKyc['id'][]): Promise<CompanyKyc[]> {
    const entities = await this.companyKycRepository.find({
      where: { id: In(ids) },
      relations: ['users'],
    });

    return entities.map((company) => CompanyKycMapper.toDomain(company));
  }

  async findAll(): Promise<CompanyKyc[]> {
    const entities = await this.companyKycRepository.find({
      relations: ['users'], // Load related entities
    });

    return entities.map((company) => CompanyKycMapper.toDomain(company));
  }

  async remove(id: CompanyKyc['id']): Promise<void> {
    if (!id) {
      return;
    }
    await this.companyKycRepository.softDelete(id);
  }
  async findByStatus(status: CompanyKyc['status']): Promise<CompanyKyc[]> {
    const entities = await this.companyKycRepository.find({
      where: { status: status },
    });
    return entities.map((company) => CompanyKycMapper.toDomain(company));
  }

  async findByCheckDayRange(
    startDate: Date,
    endDate: Date,
  ): Promise<CompanyKyc[]> {
    const entities = await this.companyKycRepository.find({
      where: { checkDay: Between(startDate, endDate) },
    });
    return entities.map((entity) => CompanyKycMapper.toDomain(entity));
  }

  async update(
    id: CompanyKyc['id'],
    updates: Partial<Omit<CompanyKyc, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<CompanyKyc> {
    await this.companyKycRepository.update(id, updates);

    const updatedEntity = await this.companyKycRepository.findOne({
      where: { id },
    });
    if (!updatedEntity) {
      throw new Error(`CompanyKyc with id ${id} not found`);
    }
    return CompanyKycMapper.toDomain(updatedEntity);
  }
}
