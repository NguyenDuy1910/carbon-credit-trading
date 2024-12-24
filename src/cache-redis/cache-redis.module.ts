import { Module, Global, Logger } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheRedisService } from './cache-redis.service';
import { redisStore } from 'cache-manager-redis-yet';
import { Cache } from 'cache-manager';
import { memoryStore } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common/cache';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        const logger = new Logger(CacheRedisModule.name);
        let store: any;

        try {
          logger.log('Connecting to Redis...');
          store = await redisStore({
            socket: {
              host: process.env.REDIS_HOST || '127.0.0.1',
              port: parseInt(process.env.REDIS_PORT || '6379', 10),
            },
            password: process.env.REDIS_PASSWORD || undefined,
          });
          logger.log('Redis connection established successfully.');
        } catch (error) {
          logger.error(
            `Redis connection failed. Falling back to in-memory cache. Error: ${error.message}`,
          );
          store = memoryStore();
          logger.log('In-memory cache initialized successfully.');
        }

        if (store?.on) {
          store.on('error', (error) =>
            logger.error(`Redis error: ${error.message}`),
          );
          store.on('end', () => {
            logger.warn('Redis connection lost. Using in-memory cache.');
            store = memoryStore();
          });
        }

        return {
          store,
          ttl: 600, // Default TTL in seconds
        };
      },
    }),
  ],
  providers: [
    {
      provide: CacheRedisService,
      useFactory: (cacheManager: Cache) => new CacheRedisService(cacheManager),
      inject: [CACHE_MANAGER],
    },
  ],
  exports: [CacheRedisService],
})
export class CacheRedisModule {}
