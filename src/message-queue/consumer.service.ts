import { IConsumer } from './interfaces/consumer.interface';
import { ConsumerConfig, ConsumerSubscribeTopics, KafkaMessage } from 'kafkajs';
import { KafkaConsumer } from './kafka/kafka.consumer';
import { OnApplicationShutdown } from '@nestjs/common';
import * as process from 'node:process';

interface KafkaConsumerOptions {
  topics: ConsumerSubscribeTopics;
  config: ConsumerConfig;
  onMessageHandle: (message: KafkaMessage) => Promise<void>;
}
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumers: IConsumer[] = [];
  constructor() {}
  async consume({
    topics,
    config,
    onMessageHandle,
  }: KafkaConsumerOptions): Promise<void> {
    const consumer = new KafkaConsumer(
      topics,
      config,
      process.env.KAFKA_BROKER || 'localhost:9092',
    );
    await consumer.connect();
    await consumer.consume(onMessageHandle);
    this.consumers.push(consumer);
  }
  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
