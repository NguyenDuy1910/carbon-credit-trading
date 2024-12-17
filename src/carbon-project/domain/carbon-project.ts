import { Exclude } from 'class-transformer';
import { AutoMap } from '@automapper/classes';

export class CarbonProject {
  @Exclude({ toPlainOnly: true })
  @AutoMap()
  id?: number;
  @AutoMap()
  name: string;
  @AutoMap()
  code: string;
  @AutoMap()
  status: string;
  @AutoMap()
  startDate: Date;
  @AutoMap()
  endDate: Date;
  @AutoMap()
  description: string;
  @AutoMap()
  createdAt: Date;
  @AutoMap()
  updatedAt: Date;
}
