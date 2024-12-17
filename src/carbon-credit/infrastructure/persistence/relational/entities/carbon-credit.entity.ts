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
import { CompanyEntity } from '../../../../../company/infrastructure/persistence/relational/entities/company.entity';
import { CreditStatus } from '../enums/credit-status.enum';
import { CarbonProjectEntity } from '../../../../../carbon-project/infrastructure/persistence/relational/entities/carbon-project.entity';
import { AutoMap } from '@automapper/classes';

@Entity({
  name: 'carbon_credits',
})
export class CarbonCreditEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'serial_number' })
  @AutoMap()
  serialNumber: string;

  @ManyToOne(() => CompanyEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'company_code', referencedColumnName: 'code' })
  @AutoMap()
  company: CompanyEntity;

  @Column({ name: 'certification_standard' })
  @AutoMap()
  certificationStandard: string;

  @Column({ name: 'issued_at' })
  @AutoMap()
  issuedAt: Date;

  @Column({ name: 'expiration_at' })
  @AutoMap()
  expirationAt: Date;

  @Column()
  @AutoMap()
  price: number;

  @Column({ type: 'enum', enum: CreditStatus, default: CreditStatus.AVAILABLE })
  @AutoMap()
  status: CreditStatus;

  @Column({ name: 'credit_amount' })
  @AutoMap()
  creditAmount: number;

  @ManyToOne(() => CarbonProjectEntity)
  @JoinColumn({ name: 'project_code', referencedColumnName: 'code' })
  @AutoMap()
  project: CarbonProjectEntity;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @AutoMap()
  deletedAt: Date;
}
