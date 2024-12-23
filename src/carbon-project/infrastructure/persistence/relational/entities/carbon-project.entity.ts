import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { CarbonProjectType } from '../enums/project-status.enum';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { CarbonCreditEntity } from '../../../../../carbon-credit/infrastructure/persistence/relational/entities/carbon-credit.entity';

@Entity({ name: 'carbon_projects' })
export class CarbonProjectEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: number; // Unique identifier of the project

  @Column({ nullable: false })
  @AutoMap()
  name: string; // Project name

  @Column({
    type: 'enum',
    enum: CarbonProjectType,
    default: CarbonProjectType.RENEWABLE,
    nullable: false,
  })
  @AutoMap()
  type: CarbonProjectType; // Type of the project (e.g., "compensation")

  @Column({ default: false })
  @AutoMap()
  isActive: boolean; // Whether the project is active

  @Column({ default: false })
  @AutoMap()
  isVintage: boolean; // Whether the project is vintage

  @Column({ type: 'float', nullable: true })
  @AutoMap()
  totalStock: number; // Total available credits

  @Column({ type: 'float', nullable: true })
  @AutoMap()
  co2Balance: number; // CO₂ balance (if applicable)

  @Column({ nullable: true })
  @AutoMap()
  cover: string; // URL of the project's cover image

  @Column({ type: 'boolean', default: false })
  @AutoMap()
  isFreeDonation: boolean; // Whether the project accepts free donations

  @Column({ nullable: true })
  @AutoMap()
  currencyToken: number; // Currency token of the project

  @Column({ type: 'float', nullable: true })
  @AutoMap()
  price: number; // Credit price (if available)

  @Column({ nullable: true })
  @AutoMap()
  countryName: string; // Name of the country where the project is implemented

  @Column({ nullable: true })
  @AutoMap()
  countryFlag: string; // URL of the country's flag

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date; // Creation timestamp

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date; // Last update timestamp
  @OneToMany(() => CarbonCreditEntity, (carbonCredit) => carbonCredit.project, {
    eager: false,
  })
  carbonCreditEntities: CarbonCreditEntity[];
}
