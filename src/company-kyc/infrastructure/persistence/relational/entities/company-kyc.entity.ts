import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { AutoMap } from '@automapper/classes';
import { CompanyEntity } from '../../../../../company/infrastructure/persistence/relational/entities/company.entity';
import { KycStatus } from '../enums/kyc-status.enum';

@Entity({ name: 'company_kyc' })
export class CompanyKycEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  @AutoMap()
  documents: string;

  @OneToMany(() => CompanyEntity, (company) => company.id)
  @JoinColumn({ name: 'company_id' })
  @AutoMap()
  companyId: CompanyEntity;

  @Column({ name: 'file' })
  @AutoMap()
  file: string;

  @Column({ name: 'check_day' })
  @AutoMap()
  checkDay: Date;

  @Column()
  @AutoMap()
  notes: string;

  @Column()
  @AutoMap()
  status: KycStatus;

  @Column({ name: 'verified_by' })
  @AutoMap()
  verifiedBy: string;

  @Column({ name: 'verified_at' })
  @AutoMap()
  verifiedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;
}
