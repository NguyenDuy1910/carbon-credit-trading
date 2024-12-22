import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderRepository } from '../order.repository';
import { OrderRelationalRepository } from './repositories/order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  providers: [
    {
      provide: OrderRepository,
      useClass: OrderRelationalRepository,
    },
  ],
  exports: [OrderRepository],
})
export class RelationalOrderPersistenceModule {}
