import { Injectable, Logger } from '@nestjs/common';
import { SqsService } from '../../queue/sqs/sqs.service';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrderProducer {
  private readonly logger = new Logger(OrderProducer.name);
  private readonly queueName = 'test.fifo';

  constructor(private readonly sqsService: SqsService) {}

  async publishOrder(
    order: CreateOrderDto,
    projectId: number,
  ): Promise<boolean> {
    try {
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
      this.logger.log('Order successfully published to queue.');
      return true;
    } catch (error) {
      this.logger.error(`Failed to publish order to queue: ${error.message}`);
      return false;
    }
  }

  private sanitizeId(id: string): string {
    return id.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 80);
  }
}
