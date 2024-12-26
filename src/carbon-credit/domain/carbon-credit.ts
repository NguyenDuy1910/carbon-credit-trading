import { AutoMap } from '@automapper/classes';
import { CarbonProject } from '../../carbon-project/domain/carbon-project';

export class CarbonCredit {
  // @Exclude({ toPlainOnly: true })
  @AutoMap()
  id: number;

  @AutoMap()
  project: CarbonProject; // Relationship with the Carbon Project domain

  @AutoMap()
  year: number;

  @AutoMap()
  stock: number;
  @AutoMap()
  version: number;
  @AutoMap()
  price: number;

  @AutoMap()
  tokenAsaId?: number;

  @AutoMap()
  availableVolumeCredits?: number;

  @AutoMap()
  haveAvailableCredits: boolean;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;

  @AutoMap()
  deletedAt?: Date;

  constructor(
    id: number,
    version: number,
    project: CarbonProject,
    year: number,
    stock: number,
    price: number,
    haveAvailableCredits = false,
    createdAt = new Date(),
    updatedAt = new Date(),
    tokenAsaId?: number,
    availableVolumeCredits?: number,
    deletedAt?: Date,
  ) {
    this.id = id;
    this.version = version;
    this.project = project;
    this.year = year;
    this.stock = stock;
    this.price = price;
    this.tokenAsaId = tokenAsaId;
    this.availableVolumeCredits = availableVolumeCredits;
    this.haveAvailableCredits = haveAvailableCredits;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
