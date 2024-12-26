import { Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQSClient } from '@aws-sdk/client-sqs';
import { SqsModule } from './sqs/sqs.module';
import { ConsumerService } from './kafka/consumer.service';
import { ProducerService } from './kafka/producer.service';

@Module({
  imports: [
    SqsModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('QueueModule');
        try {
          logger.log('Initializing SQS configuration...');

          const consumers = [
            {
              name: 'test.fifo',
              queueUrl:
                configService.get<string>('SQS_QUEUE_URL', {
                  infer: true,
                }) ??
                'https://sqs.us-east-1.amazonaws.com/182399680681/test.fifo',
              sqs: new SQSClient({
                apiVersion: '2024-11-08',
                credentials: {
                  accessKeyId:
                    configService.get<string>('AWS_ACCESS_KEY_ID', {
                      infer: true,
                    }) ?? 'default_access_key',
                  secretAccessKey:
                    configService.get<string>('AWS_SECRET_ACCESS_KEY', {
                      infer: true,
                    }) ?? 'default_secret_key',
                },
                endpoint:
                  configService.get<string>('SQS_ENDPOINT', {
                    infer: true,
                  }) ?? 'http://localhost:4566', // Local development support
                region:
                  configService.get<string>('AWS_REGION', {
                    infer: true,
                  }) ?? 'us-east-1', // Fallback to default region
              }),
            },
          ];

          const producers = [
            {
              name: 'test.fifo',
              queueUrl:
                configService.get<string>('SQS_QUEUE_URL', {
                  infer: true,
                }) ??
                'https://sqs.us-east-1.amazonaws.com/182399680681/test.fifo',
              sqs: new SQSClient({
                region:
                  configService.get<string>('AWS_REGION', {
                    infer: true,
                  }) ?? 'us-east-1',
                credentials: {
                  accessKeyId:
                    configService.get<string>('AWS_ACCESS_KEY_ID', {
                      infer: true,
                    }) ?? 'default_access_key',
                  secretAccessKey:
                    configService.get<string>('AWS_SECRET_ACCESS_KEY', {
                      infer: true,
                    }) ?? 'default_secret_key',
                },
              }),
            },
          ];

          logger.log('SQS configuration initialized successfully.');
          return { consumers, producers, logger };
        } catch (error) {
          logger.error('Failed to initialize SQS configuration', error.stack);

          // Fallback logic: return empty consumers and producers
          return {
            consumers: [],
            producers: [],
            logger,
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [ConsumerService, ProducerService],
  exports: [ConsumerService, ProducerService, SqsModule],
})
export class QueueModule {}
