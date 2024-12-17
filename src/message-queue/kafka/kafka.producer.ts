import { IProducer } from '../interfaces/producer.interface';
import { Kafka, Message, Producer } from 'kafkajs';
import { Logger } from '@nestjs/common';
import { sleep } from '../utils/sleep';

export class KafkaProducer implements IProducer {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly logger: Logger;
  constructor(
    private readonly topic: string,
    broker: string,
  ) {
    this.kafka = new Kafka({
      brokers: [broker],
    });
    this.producer = this.kafka.producer();
    this.logger = new Logger(topic);
  }
  async produce(message: Message) {
    await this.producer.send({ topic: this.topic, messages: [message] });
  }
  async connect(): Promise<void> {
    try {
      await this.producer.connect();
    } catch (err) {
      this.logger.error('Failed to connect to Kafka.', err);
      await sleep(5000);
      await this.connect();
    }
  }
  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }
}
