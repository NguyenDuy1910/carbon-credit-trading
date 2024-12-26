import {
  DynamicModule,
  Global,
  Module,
  Provider,
  Type,
  Logger,
} from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';

import { SQS_OPTIONS } from './decorator/sqs.constants';
import {
  SqsModuleAsyncOptions,
  SqsModuleOptionsFactory,
  SqsOptions,
} from './type/sqs.types';
import { SqsService } from './sqs.service';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [SqsService],
  exports: [SqsService],
  controllers: [],
})
export class SqsModule {
  private static readonly logger = new Logger(SqsModule.name);

  public static register(options: SqsOptions): DynamicModule {
    try {
      const sqsOptions: Provider = {
        provide: SQS_OPTIONS,
        useValue: options,
      };

      const sqsProvider: Provider = {
        provide: SqsService,
        useFactory: (sqsOptions: SqsOptions, discover: DiscoveryService) => {
          this.logger.log('Initializing SqsService with provided options...');
          return new SqsService(sqsOptions, discover);
        },
        inject: [SQS_OPTIONS, DiscoveryService],
      };

      return {
        global: true,
        module: SqsModule,
        imports: [DiscoveryModule],
        providers: [sqsOptions, sqsProvider],
        exports: [sqsProvider],
      };
    } catch (error) {
      this.logger.error('Error while registering SqsModule', error.stack);
      return {
        global: true,
        module: SqsModule,
        imports: [DiscoveryModule],
        providers: [],
        exports: [],
      };
    }
  }

  public static registerAsync(options: SqsModuleAsyncOptions): DynamicModule {
    try {
      const asyncProviders = this.createAsyncProviders(options);

      const sqsProvider: Provider = {
        provide: SqsService,
        useFactory: (options: SqsOptions, discover: DiscoveryService) => {
          this.logger.log('Initializing SqsService asynchronously...');
          return new SqsService(options, discover);
        },
        inject: [SQS_OPTIONS, DiscoveryService],
      };

      return {
        global: true,
        module: SqsModule,
        imports: [DiscoveryModule, ...(options.imports ?? [])],
        providers: [...asyncProviders, sqsProvider],
        exports: [sqsProvider],
      };
    } catch (error) {
      this.logger.error(
        'Error while registering SqsModule asynchronously',
        error.stack,
      );
      return {
        global: true,
        module: SqsModule,
        imports: [DiscoveryModule],
        providers: [],
        exports: [],
      };
    }
  }

  private static createAsyncProviders(
    options: SqsModuleAsyncOptions,
  ): Provider[] {
    try {
      if (options.useExisting || options.useFactory) {
        return [this.createAsyncOptionsProvider(options)];
      }
      const useClass = options.useClass as Type<SqsModuleOptionsFactory>;
      return [
        this.createAsyncOptionsProvider(options),
        {
          provide: useClass,
          useClass,
        },
      ];
    } catch (error) {
      this.logger.error('Error while creating async providers', error.stack);
      return [];
    }
  }

  private static createAsyncOptionsProvider(
    options: SqsModuleAsyncOptions,
  ): Provider {
    try {
      if (options.useFactory) {
        return {
          provide: SQS_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        };
      }

      const inject = [
        (options.useClass ||
          options.useExisting) as Type<SqsModuleOptionsFactory>,
      ];
      return {
        provide: SQS_OPTIONS,
        useFactory: async (optionsFactory: SqsModuleOptionsFactory) => {
          this.logger.log('Creating async SQS options...');
          return optionsFactory.createOptions();
        },
        inject,
      };
    } catch (error) {
      this.logger.error(
        'Error while creating async options provider',
        error.stack,
      );
      return {
        provide: SQS_OPTIONS,
        useValue: {}, // Fallback to an empty object
      };
    }
  }
}
