import { DocumentEntity } from './relational/entities/document.entity';

export abstract class DocumentRepository {
  abstract create(document: DocumentEntity): Promise<DocumentEntity>;
  abstract findById(id: string): Promise<DocumentEntity>;
  abstract update(
    id: string,
    document: DocumentEntity,
  ): Promise<DocumentEntity>;
}
