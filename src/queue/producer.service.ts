import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Message } from 'kafkajs';

import process from 'node:process';
import { IProducer } from './kafka/interfaces/producer.interface';
import { KafkaProducer } from './kafka/kafka.producer';

@Injectable()
export class ProducerService implements OnApplicationShutdown {
  private readonly producers = new Map<string, IProducer>();

  constructor() {}

  async produce(
    topic: string,
    message: Message,
    partitionCount: number = 1,
    replicationFactor: number = 1,
  ) {
    const producer = await this.getProducer(
      topic,
      partitionCount,
      replicationFactor,
    );
    await producer.produce(message);
  }

  private async getProducer(
    topic: string,
    partitionCount: number,
    replicationFactor: number,
  ): Promise<IProducer> {
    let producer = this.producers.get(topic);
    if (!producer) {
      producer = new KafkaProducer(
        topic,
        process.env.KAFKA_BROKER || 'localhost:9092',
        partitionCount,
        replicationFactor,
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
