import { AutoMap } from '@automapper/classes';
import { CarbonProject } from '../../carbon-project/domain/carbon-project';

export class CarbonCredit {
  // @Exclude({ toPlainOnly: true })
  @AutoMap()
  id: number;

  @AutoMap()
  project: CarbonProject; // Relationship with the Carbon Project domain

  @AutoMap()
  year: number; // Year of carbon credit issuance

  @AutoMap()
  stock: number; // Total stock of credits

  @AutoMap()
  price: number; // Price per credit

  @AutoMap()
  tokenAsaId?: number; // Token ID representing the carbon credit (optional)

  @AutoMap()
  availableVolumeCredits?: number; // Volume of credits available for trade (optional)

  @AutoMap()
  haveAvailableCredits: boolean; // Indicates if credits are available for trading

  @AutoMap()
  createdAt: Date; // Timestamp of record creation

  @AutoMap()
  updatedAt: Date; // Timestamp of last update

  @AutoMap()
  deletedAt?: Date; // Timestamp of deletion (optional for soft deletes)

  constructor(
    id: number,
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
