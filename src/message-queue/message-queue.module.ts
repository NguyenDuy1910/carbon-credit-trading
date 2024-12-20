import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ProducerService } from './producer.service';

@Module({
  imports: [],
  providers: [ConsumerService, ProducerService],
  exports: [ConsumerService, ProducerService],
})
export class MessageQueueModule {}
