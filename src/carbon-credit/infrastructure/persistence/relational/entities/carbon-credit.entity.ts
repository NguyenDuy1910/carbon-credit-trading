import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
  VersionColumn,
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
  id: number;

  @ManyToOne(() => CarbonProjectEntity, { eager: false })
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  @AutoMap()
  project: CarbonProjectEntity; // Relationship with the Carbon Project

  @Column({ name: 'year', nullable: false })
  @AutoMap()
  year: number;

  @Column({ nullable: false })
  @AutoMap()
  stock: number;

  @Column({ type: 'float', nullable: false })
  @AutoMap()
  price: number;
  @VersionColumn()
  @AutoMap()
  version: number;

  @Column({ name: 'token_asa_id', type: 'int', nullable: true })
  @AutoMap()
  tokenAsaId: number;

  @Column({ name: 'available_volume_credits', type: 'float', nullable: true })
  @AutoMap()
  availableVolumeCredits: number;

  @Column({ name: 'have_available_credits', type: 'boolean', default: false })
  @AutoMap()
  haveAvailableCredits: boolean;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @AutoMap()
  deletedAt: Date | null;
}
