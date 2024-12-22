import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { CarbonCreditEntity } from '../../../../../carbon-credit/infrastructure/persistence/relational/entities/carbon-credit.entity';

@Entity({
  name: 'orders',
})
export class OrderEntity {
  @PrimaryGeneratedColumn('increment')
  @AutoMap()
  id: number;

  @Column({ name: 'buyer_id', nullable: false })
  @AutoMap()
  buyerId: string;

  @Column({ name: 'seller_id', nullable: false })
  @AutoMap()
  sellerId: string;

  @ManyToOne(() => CarbonCreditEntity, { eager: false })
  @JoinColumn({ name: 'carbon_credit_id', referencedColumnName: 'id' })
  @AutoMap(() => CarbonCreditEntity)
  carbonCredit: CarbonCreditEntity; // Relation to Carbon Credit

  @Column({ name: 'quantity', type: 'float', nullable: false })
  @AutoMap()
  quantity: number;

  @Column({ name: 'price_per_unit', type: 'float', nullable: false })
  @AutoMap()
  pricePerUnit: number;

  @Column({ name: 'total_price', type: 'float', nullable: false })
  @AutoMap()
  totalPrice: number;

  @Column({
    name: 'currency',
    type: 'varchar',
    length: 10,
    default: 'USD',
  })
  @AutoMap()
  currency: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['Pending', 'Completed', 'Cancelled', 'Failed'],
    default: 'Pending',
  })
  @AutoMap()
  status: string;

  @Column({ name: 'payment_method', nullable: false })
  @AutoMap()
  paymentMethod: string;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;
}
