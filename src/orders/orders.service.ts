import { Injectable, Logger } from '@nestjs/common';
import { CacheRedisService } from '../cache-redis/cache-redis.service';
import { CarbonCreditService } from '../carbon-credit/carbon-credit.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderRepository } from './infrastructure/persistence/order.repository';
import { Order } from './domain/order';
import { CarbonProjectService } from '../carbon-project/carbon-project.service';
import { OrderProducer } from './producers/order.producer';
import { CarbonCredit } from '../carbon-credit/domain/carbon-credit';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly redisPrefix = 'orders';

  constructor(
    private readonly redisService: CacheRedisService,
    private readonly creditService: CarbonCreditService,
    private readonly carbonProjectService: CarbonProjectService,
    private readonly orderRepository: OrderRepository,
    private readonly orderProducer: OrderProducer,
  ) {}

  /**
   * Create an order and update stock using optimistic locking.
   */
  async createOrder(
    order: CreateOrderDto,
    projectId: number,
  ): Promise<Order | null> {
    try {
      const key = `carbon_credit:${order.carbonCreditId}`;
      const version = 1;

      const success = await this.redisService.optimisticLock(
        'DecreaseStock',
        key,
        (currentStock: CarbonCredit) => this.updateStock(currentStock, version),
      );

      if (!success) {
        this.logger.error('Optimistic lock failed while decreasing stock.');
        return null;
      }

      return await this.orderRepository.create(order);
    } catch (error) {
      this.logger.error(
        `Failed to create order: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Update the stock for a given CarbonCredit object.
   */
  private updateStock(carbonCredit: CarbonCredit, version: number): any {
    // Define a fixed quantity or calculate it based on some logic
    const quantity = this.getQuantityToSubtract(); // Replace with your logic

    // Validate inputs
    if (!carbonCredit) {
      this.logger.error('CarbonCredit object is null or undefined.');
      return null;
    }

    if (quantity <= 0) {
      this.logger.error('Quantity must be greater than zero.');
      return null;
    }

    // Validate available stock
    if (
      carbonCredit.availableVolumeCredits === null ||
      carbonCredit.availableVolumeCredits === undefined
    ) {
      this.logger.warn('AvailableVolumeCredits is null or undefined.');
      return null;
    }

    if (carbonCredit.availableVolumeCredits < quantity) {
      this.logger.warn(
        `Insufficient stock. Available: ${carbonCredit.availableVolumeCredits}, Required: ${quantity}`,
      );
      return null;
    }

    // Update stock
    const updatedStock = carbonCredit.availableVolumeCredits - quantity;
    const updatedCarbonCredit = {
      ...carbonCredit,
      availableVolumeCredits: updatedStock,
      version: version,
    };

    this.logger.log(
      `Stock updated successfully. New stock: ${updatedCarbonCredit.availableVolumeCredits}, New version: ${updatedCarbonCredit.version}`,
    );

    return updatedCarbonCredit;
  }

  // Example method for determining quantity
  private getQuantityToSubtract(): number {
    // Implement logic to calculate or fetch the quantity
    return 10; // Example fixed quantity
  }

  async getOrder(orderId: string): Promise<any> {
    try {
      const order = await this.redisService.get(
        `${this.redisPrefix}:${orderId}`,
      );
      if (!order) {
        this.logger.warn(`Order with ID ${orderId} not found in cache.`);
        return null;
      }
      return order;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve order ${orderId}: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Delete an order from Redis by ID.
   */
  async deleteOrder(orderId: string): Promise<void> {
    try {
      await this.redisService.del(`${this.redisPrefix}:${orderId}`);
      this.logger.log(`Order with ID ${orderId} deleted from cache.`);
    } catch (error) {
      this.logger.error(
        `Failed to delete order ${orderId}: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Validate and update credit quantity for an order.
   */
  private async validateAndUpdateCredit(
    order: CreateOrderDto,
  ): Promise<CarbonCredit | null> {
    try {
      const credit = await this.creditService.findById(order.carbonCreditId);

      if (!credit || credit!.availableVolumeCredits! < order.quantity) {
        this.logger.warn(
          'Insufficient available volume credits for the order.',
        );
        return null;
      }

      credit!.availableVolumeCredits! -= order.quantity;
      return credit;
    } catch (error) {
      this.logger.error(
        `Failed to validate and update credit: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Handle results of multiple asynchronous operations.
   */
  private handlePromiseResults(results: PromiseSettledResult<any>[]): void {
    results.forEach((result, index) => {
      const operation = index === 0 ? 'updateCreditQuantity' : 'createOrder';
      if (result.status === 'rejected') {
        this.logger.warn(`${operation} failed: ${result.reason}`);
      }
    });
  }
}
