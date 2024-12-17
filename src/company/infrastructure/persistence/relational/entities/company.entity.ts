import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { AutoMap } from '@automapper/classes';

@Entity({
  name: 'companies',
})
export class CompanyEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'company_code' })
  @Index({ unique: true })
  @AutoMap()
  code: string;

  @Column({ name: 'company_name' })
  @AutoMap()
  name: string;

  @Column({ name: 'company_address' })
  @AutoMap()
  address: string;

  @Column({ name: 'postal_code', nullable: true })
  @AutoMap()
  postalCode?: string;

  @Column({ name: 'profile_code', nullable: true })
  @AutoMap()
  profileCode?: string;

  @Column({ name: 'company_email' })
  @AutoMap()
  email: string;

  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'logo_id' })
  @AutoMap()
  logo?: FileEntity | null;

  @Column({ name: 'website' })
  @AutoMap()
  website: string;

  @Column({ name: 'registration_number' })
  @AutoMap()
  registerNumber: string;

  @Column({ name: 'company_type', nullable: true })
  @AutoMap()
  companyType: string;

  @Column({ name: 'description', nullable: true })
  @AutoMap()
  description: string;

  @Column({ name: 'representative_name' })
  @AutoMap()
  representativeName: string;

  @Column({ name: 'is_active', default: true })
  @AutoMap()
  isActive: boolean;

  @Column({ name: 'location', nullable: true })
  @AutoMap()
  location: string;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  generateCompanyCode() {
    if (this.name) {
      const uuidValue = this.uuid({
        prefix: this.name,
      });
      this.code = uuidValue;
    } else {
      throw new Error('Name and ID are required to generate company_code.');
    }
  }

  private uuid(opts: { prefix: string }) {
    opts = Object.assign({}, { prefix: '', suffix: '' }, opts);

    const id = Date.now(); // using datetime create unique uuid

    return opts.prefix + id;
  }
}
