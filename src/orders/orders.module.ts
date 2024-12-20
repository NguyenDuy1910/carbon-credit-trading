import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CacheRedisModule } from '../cache-redis/cache-redis.module';
import { CarbonCreditModule } from '../carbon-credit/carbon-credit.module';
import { MessageQueueModule } from '../message-queue/message-queue.module';

@Module({
  imports: [CacheRedisModule.forRoot(), CarbonCreditModule, MessageQueueModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
