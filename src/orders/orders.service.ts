import { Injectable } from '@nestjs/common';
import { CacheRedisService } from '../cache-redis/cache-redis.service';
import { CarbonCreditService } from '../carbon-credit/carbon-credit.service';
import { ProducerService } from '../message-queue/producer.service';

@Injectable()
export class OrdersService {
  private readonly redisPrefix = 'orders';
  private readonly topicPrefix = 'order-carbonProject';

  constructor(
    private readonly redisService: CacheRedisService,
    private readonly creditService: CarbonCreditService,
    private readonly producerService: ProducerService,
  ) {}

  async createOrder(projectId: number, creditId: number): Promise<void> {
    // Fetch the carbon credit by ID
    const credit = await this.creditService.findById(creditId);
    if (!credit) {
      throw new Error(`Credit with ID ${creditId} not found`);
    }
    if (!projectId) {
      throw new Error('Invalid project ID');
    }
    const partitionCount = 5; // Total number of partitions for the topic
    const partition = credit.year % partitionCount;
    const message = {
      key: `credit-${creditId}`, // Unique key for this credit
      value: JSON.stringify({
        availableVolumeCredits: credit.availableVolumeCredits,
        projectId,
      }), // Value containing the credit information
      partition,
    };
    // Generate the topic name dynamically
    const topic = `order-carbonProject-${projectId}`;

    // Publish the message to the Kafka topic
    await this.producerService.produce(topic, message);

    // Log for debugging purposes
    console.log(
      `Message sent to topic "${topic}" on partition ${partition}`,
      message,
    );
  }

  async getOrder(orderId: string): Promise<any> {
    const key = `${this.redisPrefix}:${orderId}`;
    const order = await this.redisService.get(key);
    if (!order) {
      throw new Error(`Unable to get order with ID ${orderId}`);
    }
    return JSON.parse(order);
  }

  async deleteOrder(orderId: string): Promise<void> {
    const key = `${this.redisPrefix}:${orderId}`;
    await this.redisService.del(key);
  }
}
