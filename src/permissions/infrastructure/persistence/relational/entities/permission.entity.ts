import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Entity({
  name: 'permission',
})
export class PermissionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  userId?: UserEntity;
  @Column({ name: 'enable_at', type: Boolean, nullable: true })
  enableAdd: boolean;

  @Column({ name: 'enable_edit', type: Boolean, nullable: true })
  enableEdit: boolean;

  @Column({ name: 'enable_delete', type: Boolean, nullable: true })
  enableDelete: boolean;

  @Column({ name: 'enable_view', type: Boolean, nullable: true })
  enableView: boolean;
}
