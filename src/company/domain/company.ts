import { FileType } from '../../files/domain/file';
import { Exclude } from 'class-transformer';
import { AutoMap } from '@automapper/classes';

export class Company {
  @Exclude({ toPlainOnly: true })
  @AutoMap()
  id?: number;

  @AutoMap()
  companyCode: string;

  @AutoMap()
  companyName: string;

  @AutoMap()
  companyAddress: string;

  @AutoMap()
  email: string;

  @AutoMap()
  postalCode?: string;

  @AutoMap()
  logo?: FileType | null;

  @AutoMap()
  website: string;

  @AutoMap()
  registerNumber: string;

  @AutoMap()
  companyType: string;

  @AutoMap()
  description: string;

  @AutoMap()
  representativeName: string;

  @AutoMap()
  location: string;
}
