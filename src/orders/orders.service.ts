import { Injectable, Logger } from '@nestjs/common';
import { CacheRedisService } from '../cache-redis/cache-redis.service';
import { CarbonCreditService } from '../carbon-credit/carbon-credit.service';
import { ProducerService } from '../queue/kafka/producer.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { SqsService } from '../queue/sqs/sqs.service';
import { SqsMessageHandler } from '../queue/sqs/decorator/sqs.decorator';
import { Message } from '@aws-sdk/client-sqs';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly redisPrefix = 'orders';
  private readonly queueName = 'test.fifo';
  constructor(
    private readonly redisService: CacheRedisService,
    private readonly creditService: CarbonCreditService,
    private readonly producerService: ProducerService,
    private readonly sqsService: SqsService,
  ) {}

  @SqsMessageHandler('test.fifo')
  public async handleTestMessage(message: Message): Promise<void> {
    // this.logger.log(`Handling message from queue: ${message.MessageId}`);

    try {
      if (!message.Body) {
        throw new Error('Message body is empty');
      }

      const parsedBody = JSON.parse(message.Body);
      this.logger.log(parsedBody);
      const order = parsedBody?.order;

      // Simulate an asynchronous operation
      await this.processOrder(order);
    } catch (error) {
      this.logger.error(
        `Error handling message: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async processOrder(order: any): Promise<void> {
    // Simulate an async operation
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.logger.log(`Order processing complete: ${JSON.stringify(order)}`);
  }

  async createOrder(order: CreateOrderDto, creditId: number): Promise<void> {
    try {
      // Validate and fetch credit
      const credit = await this.creditService.findById(creditId);
      if (!credit) {
        throw new Error(`Credit with ID ${creditId} not found`);
      }

      // Validate order
      if (!order || !order.buyerId) {
        throw new Error('Invalid order data');
      }

      // Publish to SQS queue
      await this.publishToQueue(order, credit);
    } catch (error) {
      this.logger.error(`Error creating order: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async publishToQueue(
    order: CreateOrderDto,
    credit: any,
  ): Promise<void> {
    const sanitizedDeduplicationId = this.sanitizeId(
      `credit-${credit.id}-${order.buyerId}-${Math.floor(Math.random() * 100000)}`, // Thêm số ngẫu nhiên ở cuối
    );

    const sanitizedGroupId = this.sanitizeId('order-created-group');

    const message = {
      id: `order-${credit.id}-${Date.now()}`, // Unique message ID
      body: {
        event: 'OrderCreated',
        availableVolumeCredits: credit.availableVolumeCredits,
        creditYear: credit.year,
        order,
        deduplicationId: sanitizedDeduplicationId,
      },
      groupId: sanitizedGroupId, // FIFO-specific group ID
      deduplicationId: sanitizedDeduplicationId, // FIFO-specific deduplication ID
    };

    try {
      await this.sqsService.send(this.queueName, message);
      // this.logger.log(
      //   `Message published to queue "${this.queueName}": ${JSON.stringify(message)}`,
      // );
    } catch (error) {
      this.logger.error(
        `Failed to publish message to queue: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getOrder(orderId: string): Promise<any> {
    try {
      const key = `${this.redisPrefix}:${orderId}`;
      const order = await this.redisService.get(key);
      if (!order) {
        throw new Error(`Order with ID ${orderId} not found`);
      }
      return JSON.parse(order);
    } catch (error) {
      this.logger.error(`Error fetching order: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteOrder(orderId: string): Promise<void> {
    try {
      const key = `${this.redisPrefix}:${orderId}`;
      await this.redisService.del(key);
      this.logger.log(`Order with ID ${orderId} deleted from cache.`);
    } catch (error) {
      this.logger.error(`Error deleting order: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Helper function to sanitize IDs for SQS
  private sanitizeId(id: string): string {
    return id.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 80); // Ensure valid characters and max 80 length
  }
}
