import { Module, DynamicModule, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { CacheRedisService } from './cache-redis.service';

@Global()
@Module({})
export class CacheRedisModule {
  static forRoot(): DynamicModule {
    const redisProvider = {
      provide: CacheRedisService,
      useFactory: () => {
        const client = new Redis({
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          password: process.env.REDIS_PASSWORD || undefined,
        });

        client.on('error', (err) => {
          console.error('Redis Client Error:', err);
        });

        return new CacheRedisService(client);
      },
    };

    return {
      module: CacheRedisModule,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}
