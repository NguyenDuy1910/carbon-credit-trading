import { Exclude } from 'class-transformer';
import { AutoMap } from '@automapper/classes';
import { CarbonCredit } from '../../carbon-credit/domain/carbon-credit';

export class Order {
  @Exclude({ toPlainOnly: true })
  @AutoMap()
  id?: number;

  @AutoMap()
  buyerId: string;

  @AutoMap()
  sellerId: string;

  @AutoMap()
  carbonCredit: CarbonCredit;

  @AutoMap()
  quantity: number;

  @AutoMap()
  pricePerUnit: number;

  @AutoMap()
  totalPrice: number;

  @AutoMap()
  currency: string;

  @AutoMap()
  status: 'Pending' | 'Completed' | 'Cancelled' | 'Failed';

  @AutoMap()
  paymentMethod: string;

  @AutoMap()
  orderDate: Date;

  @AutoMap()
  deliveryDate?: Date;

  @AutoMap()
  notes?: string;
}
