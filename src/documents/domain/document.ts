import { AutoMap } from '@automapper/classes';
import { CarbonProject } from '../../carbon-project/domain/carbon-project';
import { FileType } from '../../files/domain/file';
export class Document {
  @AutoMap()
  id: number;

  @AutoMap()
  path: string;

  @AutoMap()
  file?: FileType | null;

  @AutoMap()
  carbonProject: CarbonProject;

  @AutoMap()
  fileType: string;

  @AutoMap()
  mimeType?: string;

  @AutoMap()
  size?: number;

  @AutoMap()
  originalName?: string;

  @AutoMap()
  documentType: string;

  @AutoMap()
  description?: string;

  @AutoMap()
  uploadedBy: string;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;
}
