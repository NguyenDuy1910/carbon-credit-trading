import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CacheRedisModule } from '../cache-redis/cache-redis.module';
import { CarbonCreditModule } from '../carbon-credit/carbon-credit.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [CacheRedisModule.forRoot(), CarbonCreditModule, QueueModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
