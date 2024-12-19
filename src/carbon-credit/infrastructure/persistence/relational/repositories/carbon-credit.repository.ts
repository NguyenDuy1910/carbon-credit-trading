import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarbonCredit } from '../../../../domain/carbon-credit';
import { CarbonCreditEntity } from '../entities/carbon-credit.entity';
import { In, Repository } from 'typeorm';
import { CarbonCreditMapper } from '../mapper/carbon-credit.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';

@Injectable()
export class CarbonCreditRelationalRepository {
  constructor(
    @InjectRepository(CarbonCreditEntity)
    private readonly carbonCreditRepository: Repository<CarbonCreditEntity>,
  ) {}
  async create(carbonCredit: CarbonCredit): Promise<CarbonCredit> {
    const persistenceModel = CarbonCreditMapper.toPersistence(carbonCredit);
    if (!persistenceModel.project?.id) {
      throw new NotFoundException('Project ID is required and not found.');
    }
    const newEntity = await this.carbonCreditRepository.save(
      this.carbonCreditRepository.create(persistenceModel),
    );
    return CarbonCreditMapper.toDomain(newEntity);
  }
  async findById(id: CarbonCredit['id']): Promise<NullableType<CarbonCredit>> {
    const carbonCredit = await this.carbonCreditRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    return carbonCredit ? CarbonCreditMapper.toDomain(carbonCredit) : null;
  }
  async findByIds(ids: CarbonCredit['id'][]): Promise<CarbonCredit[]> {
    const entities = await this.carbonCreditRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((carbonCredit) =>
      CarbonCreditMapper.toDomain(carbonCredit),
    );
  }
  async remove(id: CarbonCredit['id']): Promise<void> {
    const credit = await this.carbonCreditRepository.findOne({
      where: { id },
    });
    if (credit) {
      credit.deletedAt = new Date();
      credit.updatedAt = new Date();
    }
  }
  async findAll(): Promise<CarbonCredit[]> {
    const allCredits = await this.carbonCreditRepository.find();
    return allCredits.map((credit) => CarbonCreditMapper.toDomain(credit));
  }
}
