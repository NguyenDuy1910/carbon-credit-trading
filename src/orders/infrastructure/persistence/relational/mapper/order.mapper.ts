import { createMap, createMapper } from '@automapper/core';
import { classes } from '@automapper/classes';
import { Order } from '../../../../domain/order';
import { OrderEntity } from '../entities/order.entity';

export const mapper = createMapper({
  strategyInitializer: classes(),
});
createMap(mapper, Order, OrderEntity);
createMap(mapper, OrderEntity, Order);
export class OrderMapper {
  static toDomain(raw: OrderEntity): Order {
    return mapper.map(raw, OrderEntity, Order);
  }
  static toPersistence(domainEntity: Order): OrderEntity {
    return mapper.map(domainEntity, Order, OrderEntity);
  }
}
