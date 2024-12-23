import { Injectable, Logger } from '@nestjs/common';
import { CacheRedisService } from '../cache-redis/cache-redis.service';
import { CarbonCreditService } from '../carbon-credit/carbon-credit.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderRepository } from './infrastructure/persistence/order.repository';
import { Order } from './domain/order';
import { CarbonProjectService } from '../carbon-project/carbon-project.service';
import { OrderProducer } from './producers/order.producer';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly redisPrefix = 'orders';

  constructor(
    private readonly redisService: CacheRedisService,
    private readonly creditService: CarbonCreditService,
    private readonly carbonProjectService: CarbonProjectService,
    private readonly orderRepository: OrderRepository,
    private readonly orderProducer: OrderProducer, // Injected producer
  ) {}

  async createOrder(
    order: CreateOrderDto,
    projectId: number,
  ): Promise<Order | null> {
    // Publish order to queue
    const isPublished = await this.orderProducer.publishOrder(order, projectId);
    if (!isPublished) {
      this.logger.error('Failed to publish order to queue');
      return null; // Graceful return to avoid breaking
    }
    // Fetch and validate carbon credit
    const credit = await this.validateAndUpdateCredit(order);
    if (!credit) {
      this.logger.error('Credit validation or update failed');
      return null;
    }

    // Create order and update credit in parallel
    const newOrder = this.orderRepository.create(order);
    const updateCredit = this.creditService.updateCreditQuantity(
      credit.id,
      credit!.availableVolumeCredits!,
    );

    const results = await Promise.allSettled([
      updateCredit,
      Promise.resolve(newOrder),
    ]);
    this.handlePromiseResults(results);

    return newOrder;
  }

  async getOrder(orderId: string): Promise<any> {
    const order = await this.redisService.get(`${this.redisPrefix}:${orderId}`);
    if (!order) {
      this.logger.warn(`Order with ID ${orderId} not found in cache.`);
      return null;
    }
    return order;
  }

  async deleteOrder(orderId: string): Promise<void> {
    await this.redisService.del(`${this.redisPrefix}:${orderId}`);
    this.logger.log(`Order with ID ${orderId} deleted from cache.`);
  }

  private async validateAndUpdateCredit(order: CreateOrderDto) {
    const credit = await this.creditService.findById(order.carbonCreditId);
    if (!credit || credit!.availableVolumeCredits! < order.quantity) {
      this.logger.warn('Insufficient available volume credits for the order.');
      return null;
    }

    credit!.availableVolumeCredits! -= order.quantity;
    return credit;
  }

  private handlePromiseResults(results: PromiseSettledResult<any>[]): void {
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const operation = index === 0 ? 'updateCreditQuantity' : 'createOrder';
        this.logger.warn(`${operation} failed: ${result.reason}`);
      }
    });
  }
}
