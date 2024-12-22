import { IProducer } from './interfaces/producer.interface';
import { Kafka, Message, Producer } from 'kafkajs';
import { Logger } from '@nestjs/common';
import { sleep } from './utils/sleep';

export class KafkaProducer implements IProducer {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly logger: Logger;

  constructor(
    private readonly topic: string,
    broker: string,
    private readonly partitionCount: number = 1,
    private readonly replicationFactor: number = 1,
  ) {
    this.kafka = new Kafka({
      brokers: [broker],
    });
    this.producer = this.kafka.producer();
    this.logger = new Logger(topic);
  }

  private async createTopicIfNotExists(): Promise<void> {
    const admin = this.kafka.admin();
    await admin.connect();

    try {
      const existingTopics = await admin.listTopics();
      if (!existingTopics.includes(this.topic)) {
        this.logger.log(
          `Creating topic "${this.topic}" with ${this.partitionCount} partitions.`,
        );
        await admin.createTopics({
          topics: [
            {
              topic: this.topic,
              numPartitions: this.partitionCount,
              replicationFactor: this.replicationFactor,
            },
          ],
        });
        this.logger.log(`Topic "${this.topic}" created successfully.`);
      } else {
        this.logger.log(`Topic "${this.topic}" already exists.`);
      }
    } catch (err) {
      this.logger.error(`Failed to create topic "${this.topic}".`, err);
    } finally {
      await admin.disconnect();
    }
  }

  async produce(message: Message): Promise<void> {
    await this.producer.send({ topic: this.topic, messages: [message] });
    this.logger.log(
      `Message sent to topic "${this.topic}": ${JSON.stringify(message)}`,
    );
  }

  async connect(): Promise<void> {
    try {
      await this.createTopicIfNotExists(); // Kiểm tra và tạo topic
      await this.producer.connect();
      this.logger.log('Connected to Kafka successfully.');
    } catch (err) {
      this.logger.error('Failed to connect to Kafka.', err);
      await sleep(5000);
      await this.connect();
    }
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
    this.logger.log('Disconnected from Kafka.');
  }
}
