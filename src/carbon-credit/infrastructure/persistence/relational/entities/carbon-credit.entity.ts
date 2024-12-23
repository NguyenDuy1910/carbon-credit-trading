import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { CarbonProjectEntity } from '../../../../../carbon-project/infrastructure/persistence/relational/entities/carbon-project.entity';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'carbon_credits',
})
export class CarbonCreditEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  @AutoMap()
  id: number; // Unique identifier for the vintage entry

  @ManyToOne(() => CarbonProjectEntity, { eager: false })
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  @AutoMap()
  project: CarbonProjectEntity; // Relationship with the Carbon Project

  @Column({ name: 'year', nullable: false })
  @AutoMap()
  year: number; // Year of carbon credit issuance

  @Column({ nullable: false })
  @AutoMap()
  stock: number; // Total stock of credits

  @Column({ type: 'float', nullable: false })
  @AutoMap()
  price: number; // Price per credit

  @Column({ name: 'token_asa_id', type: 'int', nullable: true })
  @AutoMap()
  tokenAsaId: number; // Token ID representing the carbon credit

  @Column({ name: 'available_volume_credits', type: 'float', nullable: true })
  @AutoMap()
  availableVolumeCredits: number; // Volume of credits available for trade

  @Column({ name: 'have_available_credits', type: 'boolean', default: false })
  @AutoMap()
  haveAvailableCredits: boolean; // Indicates if credits are available for trading

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date; // Timestamp of record creation

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date; // Timestamp of last update

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @AutoMap()
  deletedAt: Date | null; // Timestamp of deletion (for soft deletes)
}
