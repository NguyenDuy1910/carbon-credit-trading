import { NullableType } from '../../../utils/types/nullable.type';
import { Order } from '../../domain/order';

export abstract class OrderRepository {
  abstract create(
    order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'carbonCredit'>,
  ): Promise<Order>;
  // abstract updateById(id: Order['id']): Promise<void>;
  // abstract deleteById(id: Order['id']): Promise<void>;
  abstract findById(id: Order['id']): Promise<NullableType<Order>>;
  abstract findAll(): Promise<Order[]>;
  // abstract findByIdWithRelations(id: Order['id']): Promise<NullableType<Order>>;
}
