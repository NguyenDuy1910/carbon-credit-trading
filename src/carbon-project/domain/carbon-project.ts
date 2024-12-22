import { AutoMap } from '@automapper/classes';
import { CarbonProjectType } from '../infrastructure/persistence/relational/enums/project-status.enum';
import { CarbonCredit } from '../../carbon-credit/domain/carbon-credit';

export class CarbonProject {
  // @Exclude({ toPlainOnly: true }) // Exclude ID during serialization
  @AutoMap()
  id: number; // Unique identifier of the project

  @AutoMap()
  name: string; // Project name
  @AutoMap()
  carbonCredit: CarbonCredit[];

  @AutoMap()
  type: CarbonProjectType; // Type of the project (e.g., "compensation")

  @AutoMap()
  isActive: boolean; // Whether the project is active

  @AutoMap()
  isVintage: boolean; // Whether the project is vintage

  @AutoMap()
  totalStock?: number; // Total available credits

  @AutoMap()
  co2Balance?: number; // CO₂ balance (if applicable)

  @AutoMap()
  cover?: string; // URL of the project's cover image

  @AutoMap()
  isFreeDonation: boolean; // Whether the project accepts free donations

  @AutoMap()
  currencyToken?: number; // Currency token of the project

  @AutoMap()
  price?: number; // Credit price (if available)

  @AutoMap()
  countryName?: string; // Name of the country where the project is implemented

  @AutoMap()
  countryFlag?: string; // URL of the country's flag

  @AutoMap()
  createdAt: Date; // Creation timestamp

  @AutoMap()
  updatedAt: Date; // Last update timestamp
}
