import { IConsumer } from './interfaces/consumer.interface';
import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  Kafka,
  KafkaMessage,
} from 'kafkajs';
import { sleep } from './utils/sleep';
import { Logger } from '@nestjs/common';
import * as retry from 'retry';

export class KafkaConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;
  constructor(
    private readonly topic: ConsumerSubscribeTopics,
    config: ConsumerConfig,
    broker: string,
  ) {
    this.kafka = new Kafka({ brokers: [broker] });
    this.consumer = this.kafka.consumer(config);
    this.logger = new Logger(KafkaConsumer.name);
  }

  async consume(messageHandler: (message: KafkaMessage) => Promise<void>) {
    await this.consumer.subscribe(this.topic);
    await this.consumer.run({
      eachMessage: async ({ message, partition }) => {
        this.logger.debug(`Processing message from partition: ${partition}`);

        const operation = retry.operation({
          retries: 3,
          factor: 2,
          minTimeout: 1000,
          maxTimeout: 5000,
        });

        await operation.attempt(async (currentAttempt) => {
          try {
            await messageHandler(message);
          } catch (error) {
            if (operation.retry(error)) {
              this.logger.error(
                `Error processing message, executing retry ${currentAttempt + 1}/${operation.retries}...`,
                error,
              );
              return;
            }

            this.logger.error(
              'Error consuming message. Adding to dead letter queue...',
              error,
            );
          }
        });
      },
    });
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      this.logger.log('Connected to Kafka successfully.');
    } catch (err) {
      this.logger.error('Failed to connect to Kafka. Retrying...', err);
      await sleep(5000);
      await this.connect();
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.consumer.disconnect();
      this.logger.log('Disconnected from Kafka successfully.');
    } catch (err) {
      this.logger.error('Failed to disconnect from Kafka.', err);
    }
  }
}
