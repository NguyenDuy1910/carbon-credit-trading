import { SQSClient } from '@aws-sdk/client-sqs';
import { DiscoveryService } from '@golevelup/nestjs-discovery';
import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer, StopOptions } from 'sqs-consumer';
import { Producer } from 'sqs-producer';
import {
  SQS_CONSUMER_EVENT_HANDLER,
  SQS_CONSUMER_METHOD,
  SQS_OPTIONS,
} from './decorator/sqs.constants';
import {
  Message,
  QueueName,
  SqsConsumerEventHandlerMeta,
  SqsConsumerMapValues,
  SqsMessageHandlerMeta,
  SqsOptions,
} from './type/sqs.types';

@Injectable()
export class SqsService implements OnModuleInit, OnModuleDestroy {
  public readonly consumers = new Map<QueueName, SqsConsumerMapValues>();
  public readonly producers = new Map<QueueName, Producer>();

  private logger: LoggerService;
  private globalStopOptions: StopOptions;

  public constructor(
    @Inject(SQS_OPTIONS) public readonly options: SqsOptions,
    private readonly discover: DiscoveryService,
  ) {}

  public async onModuleInit(): Promise<void> {
    try {
      this.logger =
        this.options.logger ?? new Logger('SqsService', { timestamp: false });
      this.globalStopOptions = this.options.globalStopOptions ?? {};

      const messageHandlers =
        await this.discover.providerMethodsWithMetaAtKey<SqsMessageHandlerMeta>(
          SQS_CONSUMER_METHOD,
        );
      const eventHandlers =
        await this.discover.providerMethodsWithMetaAtKey<SqsConsumerEventHandlerMeta>(
          SQS_CONSUMER_EVENT_HANDLER,
        );

      this.options.consumers?.forEach((options) => {
        const { name, stopOptions, ...consumerOptions } = options;

        if (this.consumers.has(name)) {
          this.logger.error(`Consumer already exists: ${name}`);
          return; // Skip duplicate consumers instead of throwing an error
        }

        const metadata = messageHandlers.find(({ meta }) => meta.name === name);
        if (!metadata) {
          this.logger.warn(`No metadata found for queue: ${name}`);
          return;
        }

        try {
          this.logger.log(`Creating consumer for queue: ${name}`);
          const isBatchHandler = metadata.meta.batch === true;

          const consumer = Consumer.create({
            ...consumerOptions,
            ...(isBatchHandler
              ? {
                  handleMessageBatch: metadata.discoveredMethod.handler.bind(
                    metadata.discoveredMethod.parentClass.instance,
                  ),
                }
              : {
                  handleMessage: metadata.discoveredMethod.handler.bind(
                    metadata.discoveredMethod.parentClass.instance,
                  ),
                }),
          });

          // Register event handlers for the consumer
          const eventsMetadata = eventHandlers.filter(
            ({ meta }) => meta.name === name,
          );
          for (const eventMetadata of eventsMetadata) {
            if (eventMetadata) {
              this.logger.log(
                `Adding event listener for event: ${eventMetadata.meta.eventName} on queue: ${name}`,
              );
              consumer.addListener(
                eventMetadata.meta.eventName,
                eventMetadata.discoveredMethod.handler.bind(
                  metadata.discoveredMethod.parentClass.instance,
                ),
              );
            }
          }

          this.consumers.set(name, {
            instance: consumer,
            stopOptions: stopOptions ?? this.globalStopOptions,
          });

          try {
            consumer.start();
            this.logger.log(
              `Consumer for queue "${name}" started successfully.`,
            );
          } catch (startError) {
            this.logger.error(
              `Failed to start consumer for queue "${name}": ${startError.message}`,
              startError.stack,
            );
          }
        } catch (error) {
          this.logger.error(
            `Failed to create consumer for queue "${name}": ${error.message}`,
            error.stack,
          );
        }
      });

      this.options.producers?.forEach((options) => {
        const { name, ...producerOptions } = options;

        if (this.producers.has(name)) {
          this.logger.error(`Producer already exists: ${name}`);
          return; // Skip duplicate producers instead of throwing an error
        }

        try {
          const producer = Producer.create(producerOptions);
          this.producers.set(name, producer);
          this.logger.log(`Producer for queue ${name} has been created.`);
        } catch (error) {
          this.logger.error(
            `Failed to create producer for queue "${name}": ${error.message}`,
            error.stack,
          );
        }
      });
    } catch (error) {
      this.logger.error(
        'Unexpected error during SQS module initialization',
        error.stack,
      );
    }
  }

  public onModuleDestroy() {
    for (const consumer of this.consumers.values()) {
      consumer.instance.stop(consumer.stopOptions);
    }
  }

  private getQueueInfo(name: QueueName) {
    if (!this.consumers.has(name) && !this.producers.has(name)) {
      throw new Error(`Consumer/Producer does not exist: ${name}`);
    }

    const { sqs, queueUrl } = (this.consumers.get(name)?.instance ??
      this.producers.get(name)) as {
      sqs: SQSClient;
      queueUrl: string;
    };
    if (!sqs) {
      throw new Error('SQS instance does not exist');
    }

    return {
      sqs,
      queueUrl,
    };
  }

  // public async purgeQueue(name: QueueName) {
  //   const { sqs, queueUrl } = this.getQueueInfo(name);
  //   const command = new PurgeQueueCommand({
  //     QueueUrl: queueUrl,
  //   });
  //   return await sqs.send(command);
  // }
  //
  // public async getQueueAttributes(name: QueueName) {
  //   const { sqs, queueUrl } = this.getQueueInfo(name);
  //   const command = new GetQueueAttributesCommand({
  //     QueueUrl: queueUrl,
  //     AttributeNames: ['All'],
  //   });
  //   const response = await sqs.send(command);
  //   return response.Attributes as { [key in QueueAttributeName]: string };
  // }

  // public getProducerQueueSize(name: QueueName) {
  //   if (!this.producers.has(name)) {
  //     throw new Error(`Producer does not exist: ${name}`);
  //   }
  //
  //   return this.producers.get(name).queueSize();
  // }

  public async send<T = any>(
    name: QueueName,
    payload: Message<T> | Message<T[]>,
  ): Promise<void> {
    if (!this.producers.has(name)) {
      throw new Error(`Producer does not exist: ${name}`);
    }

    const originalMessages = Array.isArray(payload) ? payload : [payload];
    const messages = originalMessages.map((message) => {
      let body = message.body;
      if (typeof body !== 'string') {
        body = JSON.stringify(body) as any;
      }

      return {
        ...message,
        body,
      };
    });

    const producer = this.producers.get(name);
    if (!producer) {
      throw new Error(`Failed to get producer for queue: ${name}`);
    }

    try {
      await producer.send(messages as any[]);
      console.log(`Messages successfully sent to queue "${name}":`, messages);
    } catch (error) {
      console.error(`Failed to send messages to queue "${name}":`, error);
      throw error; // Re-throw the error to let the caller handle it if needed
    }
  }
}
