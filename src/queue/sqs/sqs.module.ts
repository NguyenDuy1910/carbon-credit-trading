import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
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
  public static register(options: SqsOptions): DynamicModule {
    const sqsOptions: Provider = {
      provide: SQS_OPTIONS,
      useValue: options,
    };
    const sqsProvider: Provider = {
      provide: SqsService,
      useFactory: (sqsOptions: SqsOptions, discover: DiscoveryService) =>
        new SqsService(options, discover),
      inject: [SQS_OPTIONS, DiscoveryService],
    };

    return {
      global: true,
      module: SqsModule,
      imports: [DiscoveryModule],
      providers: [sqsOptions, sqsProvider],
      exports: [sqsProvider],
    };
  }

  public static registerAsync(options: SqsModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    const sqsProvider: Provider = {
      provide: SqsService,
      useFactory: (options: SqsOptions, discover: DiscoveryService) =>
        new SqsService(options, discover),
      inject: [SQS_OPTIONS, DiscoveryService],
    };

    return {
      global: true,
      module: SqsModule,
      imports: [DiscoveryModule, ...(options.imports ?? [])],
      providers: [...asyncProviders, sqsProvider],
      exports: [sqsProvider],
    };
  }

  private static createAsyncProviders(
    options: SqsModuleAsyncOptions,
  ): Provider[] {
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
  }

  private static createAsyncOptionsProvider(
    options: SqsModuleAsyncOptions,
  ): Provider {
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
      useFactory: async (optionsFactory: SqsModuleOptionsFactory) =>
        await optionsFactory.createOptions(),
      inject,
    };
  }
}
