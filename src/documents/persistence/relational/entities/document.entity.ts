import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { EntityRelationalHelper } from '../../../../utils/relational-entity-helper';
import { FileEntity } from '../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { CarbonProjectEntity } from '../../../../carbon-project/infrastructure/persistence/relational/entities/carbon-project.entity';

@Entity({
  name: 'documents',
})
export class DocumentEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: number; // Unique identifier

  @Column({ name: 'path', nullable: false })
  @AutoMap()
  path: string; // Path to the document

  @OneToOne(() => FileEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'file' })
  @AutoMap()
  file?: FileEntity | null;
  @ManyToOne(() => CarbonProjectEntity, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'carbon_project_id' })
  @AutoMap()
  carbonProject: CarbonProjectEntity; // Relation to the Carbon Project

  @Column({ name: 'file_type', nullable: false })
  @AutoMap()
  fileType: string;

  @Column({ name: 'mime_type', nullable: true })
  @AutoMap()
  mimeType?: string; // MIME type of the file (e.g., 'application/pdf', 'image/jpeg')

  @Column({ name: 'size', type: 'float', nullable: true })
  @AutoMap()
  size?: number; // File size in bytes

  @Column({ name: 'original_name', nullable: true })
  @AutoMap()
  originalName?: string; // Original name of the file

  @Column({ name: 'document_type', nullable: true })
  @AutoMap()
  documentType: string; // Type of document (e.g., 'report', 'invoice')

  @Column({ name: 'description', nullable: true })
  @AutoMap()
  description: string; // Optional description of the document

  @Column({ name: 'uploaded_by', nullable: false })
  @AutoMap()
  uploadedBy: string; // User who uploaded the document

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date; // Timestamp of creation

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date; // Timestamp of the last update
}
