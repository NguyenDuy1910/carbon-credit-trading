import { Injectable } from '@nestjs/common';
import { Order } from '../../../../domain/order';
import { OrderRepository } from '../../order.repository';
import { OrderEntity } from '../entities/order.entity';
import { OrderMapper } from '../mapper/order.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';

@Injectable()
export class OrderRelationalRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async create(data: Order): Promise<Order> {
    const persistenceModel = OrderMapper.toPersistence(data);

    const newEntity = await this.orderRepository.save(
      this.orderRepository.create(persistenceModel),
    );
    return OrderMapper.toDomain(newEntity);
  }

  async findById(id: Order['id']): Promise<NullableType<Order>> {
    const order = await this.orderRepository.findOne({
      where: { id: Number(id) },
    });
    return order ? OrderMapper.toDomain(order) : null;
  }

  async findAll(): Promise<Order[]> {
    const entities = await this.orderRepository.find({
      relations: ['credit'], // Load related entities
    });

    return entities.map((company) => OrderMapper.toDomain(company));
  }

  async remove(id: Order['id']): Promise<void> {
    if (!id) {
      return;
    }
    await this.orderRepository.softDelete(id);
  }

  // async deleteById(id: Order['id']): Promise<void> {
  //   return this.orderRepository.de
  // }
  //
  // async findByIdWithRelations(id: Order['id']): Promise<NullableType<Order>> {
  //   return Promise.resolve(undefined);
  // }
  //
  // async updateById(id: Order['id']): Promise<void> {
  //   return Promise.resolve(undefined);
  // }
}
