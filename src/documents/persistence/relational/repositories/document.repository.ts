import { InjectRepository } from '@nestjs/typeorm';
import { DocumentEntity } from '../entities/document.entity';
import { CreatePermissionDto } from '../../../../permissions/dto/create-permission.dto';
import { Repository } from 'typeorm';
import { Document } from '../../../domain/document';

export class DocumentRelationalRepository {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
  ) {}
}
