import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Message } from 'kafkajs';
import { KafkaProducer } from './kafka/kafka.producer';
import { IProducer } from './interfaces/producer.interface';
import process from 'node:process';

@Injectable()
export class ProducerService implements OnApplicationShutdown {
  private readonly producers = new Map<string, IProducer>();

  constructor() {}

  async produce(topic: string, message: Message) {
    const producer = await this.getProducer(topic);
    await producer.produce(message);
  }

  private async getProducer(topic: string): Promise<IProducer> {
    let producer = this.producers.get(topic);
    if (!producer) {
      producer = new KafkaProducer(
        topic,
        process.env.KAFKA_BROKER || 'localhost:9092',
      );
      await producer.connect();
      this.producers.set(topic, producer);
    }
    return producer;
  }

  async onApplicationShutdown() {
    for (const producer of this.producers.values()) {
      await producer.disconnect();
    }
  }
}
