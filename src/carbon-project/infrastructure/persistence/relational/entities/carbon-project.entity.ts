import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ProjectStatus } from '../enums/project-status.enum';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'carbon_projects' })
export class CarbonProjectEntity {
  @PrimaryGeneratedColumn('increment')
  @AutoMap()
  id: number;

  @Column({ nullable: false })
  @AutoMap()
  name: string;

  @Column({ nullable: false })
  @Index({ unique: true })
  @AutoMap()
  code: string;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.PENDING })
  @AutoMap()
  status: ProjectStatus;

  @Column({ name: 'start_date' })
  @AutoMap()
  startDate: Date;

  @Column({ name: 'end_date' })
  @AutoMap()
  endDate: Date;

  @Column({})
  @AutoMap()
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  generateCode() {
    const formattedDate = this.startDate
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');

    this.code = `${this.name.slice(0, 3).toUpperCase()}-${formattedDate}`;
  }
}
