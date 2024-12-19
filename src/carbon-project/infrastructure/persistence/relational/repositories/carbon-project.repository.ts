import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarbonProjectEntity } from '../entities/carbon-project.entity';
import { CarbonProject } from '../../../../domain/carbon-project';
import { Repository } from 'typeorm';
import { CarbonProjectMapper } from '../mapper/carbon-project.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';

@Injectable()
export class CarbonProjectRelationalRepository {
  constructor(
    @InjectRepository(CarbonProjectEntity)
    private readonly carbonProjectRepository: Repository<CarbonProjectEntity>,
  ) {}
  async create(carbonProject: CarbonProject) {
    const persistenceModel = CarbonProjectMapper.toPersistence(carbonProject);
    const newEntity = await this.carbonProjectRepository.save(
      this.carbonProjectRepository.create(persistenceModel),
    );
    return CarbonProjectMapper.toDomain(newEntity);
  }
  async findById(
    id: CarbonProject['id'],
  ): Promise<NullableType<CarbonProject>> {
    const entity = await this.carbonProjectRepository.findOne({
      where: { id },
    });
    return entity ? CarbonProjectMapper.toDomain(entity) : null;
  }
  async findByIdWithRelations(
    id: CarbonProject['id'],
  ): Promise<NullableType<CarbonProject>> {
    const entity = await this.carbonProjectRepository.findOne({
      where: { id },
      relations: ['carbonCreditEntities'], // Load related entities
    });
    return entity ? CarbonProjectMapper.toDomain(entity) : null;
  }
  async findAll(): Promise<CarbonProject[]> {
    const allProjects = await this.carbonProjectRepository.find();
    return allProjects.map((project) => CarbonProjectMapper.toDomain(project));
  }
}
