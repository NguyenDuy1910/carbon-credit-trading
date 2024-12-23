import { Module, DynamicModule, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheRedisService } from './cache-redis.service';
import { redisStore } from 'cache-manager-redis-yet';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common/cache';

@Global()
@Module({})
export class CacheRedisModule {
  static forRoot(): DynamicModule {
    const redisProvider = {
      provide: CacheRedisService,
      useFactory: (cacheManager: Cache) => new CacheRedisService(cacheManager),
      inject: [CACHE_MANAGER],
    };

    return {
      module: CacheRedisModule,
      imports: [
        CacheModule.registerAsync({
          useFactory: async () => ({
            store: await redisStore({
              socket: {
                host: process.env.REDIS_HOST || '127.0.0.1',
                port: parseInt(process.env.REDIS_PORT || '6379', 10),
              },
              password: process.env.REDIS_PASSWORD || undefined,
            }),
            ttl: 600, // Default TTL in seconds
          }),
        }),
      ],
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}
