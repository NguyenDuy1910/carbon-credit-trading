import { Injectable, Logger } from '@nestjs/common';
import { CacheRedisService } from '../cache-redis/cache-redis.service';
import { CarbonCreditService } from '../carbon-credit/carbon-credit.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { SqsService } from '../queue/sqs/sqs.service';
import { SqsMessageHandler } from '../queue/sqs/decorator/sqs.decorator';
import { Message } from '@aws-sdk/client-sqs';
import { OrderRepository } from './infrastructure/persistence/order.repository';
import { Order } from './domain/order';
import { CarbonProject } from '../carbon-project/domain/carbon-project';
import { CarbonProjectService } from '../carbon-project/carbon-project.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly redisPrefix = 'orders';
  private readonly queueName = 'test.fifo';

  constructor(
    private readonly redisService: CacheRedisService,
    private readonly creditService: CarbonCreditService,
    private readonly carbonProjectService: CarbonProjectService,
    private readonly sqsService: SqsService,
    private readonly orderRepository: OrderRepository,
  ) {}

  @SqsMessageHandler('test.fifo')
  async handleTestMessage(message: Message): Promise<void> {
    const { projectId, order } = JSON.parse(message.Body || '{}');
    // this.logger.log(
    //   `Project ID: ${projectId}, Order: ${JSON.stringify(order)}`,
    // );
    if (!order) throw new Error('Order data is missing');
    await this.processOrder(projectId, order);
  }

  private async processOrder(projectId: number, order: any): Promise<void> {
    const cacheKey = `carbon-project:${projectId}`;

    let carbonProject: CarbonProject | null =
      await this.redisService.get<CarbonProject>(cacheKey);

    if (carbonProject) {
      const credit = carbonProject.carbonCredit.find(
        (c) => c.id === order.carbonCreditId,
      );

      if (!credit) {
        throw new Error(
          `Carbon credit with ID ${order.carbonCreditId} not found in project ${projectId}.`,
        );
      }

      // Validate available credits
      if (credit!.availableVolumeCredits! < order.quantity) {
        this.logger.log('quantity carbon credit not enough');
      }
      credit!.availableVolumeCredits! -= order.quantity;
      if (credit!.availableVolumeCredits! < 0) {
        throw new Error(
          `Invalid state: availableVolumeCredits for credit ID ${credit.id} is less than zero after deduction.`,
        );
      }
      await this.redisService.set(cacheKey, carbonProject, 600);

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 100));
      this.logger.log(
        `Order processed for project ID ${projectId}. Updated available credits: ${credit.availableVolumeCredits}`,
      );
    } else {
      this.logger.log(
        `Cache miss for project ID ${projectId}. Fetching from service.`,
      );
      carbonProject =
        await this.carbonProjectService.findProjectByIdWithRelations(projectId);

      if (!carbonProject) {
        throw new Error(`Carbon project with ID ${projectId} not found.`);
      }
    }
  }

  // async createOrder(order: CreateOrderDto, projectId: number): Promise<Order> {
  //   const publish = this.publishToQueue(order, projectId);
  //   const credit = await this.creditService.findById(order.carbonCreditId);
  //   if (!credit || credit!.availableVolumeCredits! < order.quantity) {
  //     throw new Error('Insufficient available volume credits');
  //   }
  //
  //   credit!.availableVolumeCredits! -= order.quantity;
  //   if (!order.buyerId) throw new Error('Invalid order data');
  //
  //   const updateCredit = await this.creditService.updateCreditQuantity(
  //     credit.id,
  //     credit!.availableVolumeCredits!,
  //   );
  //   const newOrder = await this.orderRepository.create(order);
  //
  //   const results = await Promise.allSettled([publish, updateCredit]);
  //   results.forEach((result, index) => {
  //     if (result.status === 'rejected') {
  //       this.logger.warn(
  //         `${index === 0 ? 'publishToQueue' : 'updateCreditQuantity'} failed: ${result.reason}`,
  //       );
  //     }
  //   });
  //
  //   return newOrder;
  // }
  async createOrder(order: CreateOrderDto, projectId: number): Promise<Order> {
    await this.publishToQueue(order, projectId).catch((error) => {
      this.logger.warn(`publishToQueue failed: ${error.message}`);
      throw new Error('Failed to publish to queue');
    });

    const credit = await this.creditService.findById(order.carbonCreditId);
    if (!credit || credit!.availableVolumeCredits! < order.quantity) {
      throw new Error('Insufficient available volume credits');
    }

    credit!.availableVolumeCredits! -= order.quantity;

    if (!order.buyerId) {
      throw new Error('Invalid order data');
    }

    const updateCredit = this.creditService.updateCreditQuantity(
      credit.id,
      credit!.availableVolumeCredits!,
    );

    const newOrder = this.orderRepository.create(order);
    const results = await Promise.allSettled([
      updateCredit,
      Promise.resolve(newOrder),
    ]);
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        this.logger.warn(
          `${index === 0 ? 'updateCreditQuantity' : 'createOrder'} failed: ${result.reason}`,
        );
      }
    });

    return newOrder;
  }

  private async publishToQueue(
    order: CreateOrderDto,
    projectId: number,
  ): Promise<void> {
    const message = {
      id: `order-${order.carbonCreditId}-${Date.now()}`,
      body: {
        event: 'OrderCreated',
        projectId,
        order,
      },
      groupId: this.sanitizeId('order-created-group'),
      deduplicationId: this.sanitizeId(
        `order-${order.carbonCreditId}-${order.buyerId}-${Math.random() * 100000}`,
      ),
    };
    await this.sqsService.send(this.queueName, message);
  }

  async getOrder(orderId: string): Promise<any> {
    const order = await this.redisService.get(`${this.redisPrefix}:${orderId}`);
    if (!order) throw new Error(`Order with ID ${orderId} not found`);
    return null;
  }

  async deleteOrder(orderId: string): Promise<void> {
    await this.redisService.del(`${this.redisPrefix}:${orderId}`);
    this.logger.log(`Order with ID ${orderId} deleted from cache.`);
  }

  private sanitizeId(id: string): string {
    return id.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 80);
  }
}
