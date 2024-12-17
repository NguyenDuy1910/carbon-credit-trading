import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { RoleEntity } from '../../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { StatusEntity } from '../../../../../statuses/infrastructure/persistence/relational/entities/status.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { CompanyEntity } from '../../../../../company/infrastructure/persistence/relational/entities/company.entity';
import { AuthProvidersEnum } from '../../../../../auth/auth-providers.enum';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'users',
})
export class UserEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Index()
  @Column({ name: 'first_name', type: String, nullable: true })
  firstName: string | null;

  @Column({ name: 'last_name', type: String, nullable: true })
  lastName: string | null;
  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @Column({ nullable: true })
  password?: string;

  @Column({ name: 'auth_provider', default: AuthProvidersEnum.email })
  authProvider: string;

  @Index()
  @Column({ name: 'social_id', type: String, nullable: true })
  socialId?: string | null;

  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'file_id' })
  profilePicture?: FileEntity | null;

  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'role_id' })
  userRole?: RoleEntity | null;

  @ManyToOne(() => StatusEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'user_status' })
  userStatus?: StatusEntity;
  @Column({ name: 'user_code', unique: true, nullable: true })
  userCode?: string;
  @ManyToOne(() => CompanyEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'company_code', referencedColumnName: 'code' })
  company?: CompanyEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  generateUserCode() {
    if (this.firstName && this.lastName) {
      const uuidValue = this.uuid({
        prefix: this.firstName.slice(0).toUpperCase(),
        suffix: this.lastName.slice(0).toUpperCase(),
      });
      this.userCode = uuidValue;
    } else {
      throw new Error('First name and ID are required to generate userCode.');
    }
  }

  private uuid(opts: { prefix: string; suffix: string }) {
    opts = Object.assign({}, { prefix: '', suffix: '' }, opts);

    const id = Date.now(); // using datetime create unique uuid

    return opts.prefix + opts.suffix + id;
  }
}
