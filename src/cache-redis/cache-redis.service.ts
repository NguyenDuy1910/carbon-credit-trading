import { Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { version } from 'mongoose';

@Injectable()
export class CacheRedisService {
  private readonly redisClient: Redis;
  private readonly logger = new Logger(CacheRedisService.name);

  constructor(private readonly cacheManager: Cache) {
    this.redisClient = new Redis();
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl); // Handles serialization
    } catch (error) {
      this.logger.error(
        `Failed to set cache for key "${key}": ${error.message}`,
        error.stack,
      );
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      return (await this.cacheManager.get<T>(key)) || null;
    } catch (error) {
      this.logger.error(
        `Failed to get cache for key "${key}": ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(
        `Failed to delete cache for key "${key}": ${error.message}`,
        error.stack,
      );
    }
  }

  async reset(): Promise<void> {
    try {
      await this.cacheManager.reset();
    } catch (error) {
      this.logger.error(`Failed to reset cache: ${error.message}`, error.stack);
    }
  }

  async resetValue(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      this.logger.error(
        `Failed to reset value for key "${key}": ${error.message}`,
        error.stack,
      );
    }
  }

  private async redisGet(key: string): Promise<string | null> {
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      this.logger.error(
        `Failed to get Redis value for key "${key}": ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  private async redisSet(
    key: string,
    value: string,
    ttl: number,
  ): Promise<void> {
    try {
      await this.redisClient.set(key, value, 'EX', ttl);
    } catch (error) {
      this.logger.error(
        `Failed to set Redis value for key "${key}": ${error.message}`,
        error.stack,
      );
    }
  }

  private async redisWatch(key: string): Promise<void> {
    try {
      await this.redisClient.watch(key);
    } catch (error) {
      this.logger.error(
        `Failed to watch key "${key}": ${error.message}`,
        error.stack,
      );
    }
  }

  private async redisUnwatch(): Promise<void> {
    try {
      await this.redisClient.unwatch();
    } catch (error) {
      this.logger.error(
        `Failed to unwatch keys: ${error.message}`,
        error.stack,
      );
    }
  }

  private async redisExec(key: string, newValue: string): Promise<boolean> {
    try {
      const multi = this.redisClient.multi();
      multi.set(key, newValue);
      const replies = await multi.exec();
      return replies !== null; // If replies are null, the transaction failed
    } catch (error) {
      this.logger.error(
        `Failed to execute Redis transaction for key "${key}": ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  // async optimisticLock<T>(
  //   taskName: string,
  //   key: string,
  //   jobCallback: (currentValue: T | null) => Promise<T>,
  //   maxRetries: number = 3,
  //   attempt: number = 1,
  // ): Promise<T | null> {
  //   try {
  //     this.logger.log(
  //       `${taskName}: Starting to watch key "${key}" (Attempt ${attempt})`,
  //     );
  //     await this.redisWatch(key);
  //     this.logger.log(`${taskName}: Successfully watching key "${key}"`);
  //
  //     const currentValue = JSON.parse(
  //       (await this.redisGet(key)) || 'null',
  //     ) as T | null;
  //     this.logger.log(
  //       `${taskName}: Current value: ${util.inspect(currentValue)}`,
  //     );
  //
  //     const newValue = await jobCallback(currentValue);
  //
  //     if (newValue) {
  //       this.logger.log(
  //         `${taskName}: New value from jobCallback: ${util.inspect(newValue)}`,
  //       );
  //
  //       const success = await this.redisExec(key, JSON.stringify(newValue));
  //
  //       if (!success) {
  //         if (attempt >= maxRetries) {
  //           this.logger.error(
  //             `${taskName}: Reached max retry attempts (${maxRetries}). Aborting.`,
  //           );
  //           return null;
  //         }
  //
  //         this.logger.warn(
  //           `${taskName}: Optimistic lock failed. Retrying (${attempt}/${maxRetries})`,
  //         );
  //         return this.optimisticLock(
  //           taskName,
  //           key,
  //           jobCallback,
  //           maxRetries,
  //           attempt + 1,
  //         );
  //       }
  //
  //       this.logger.log(`${taskName}: Transaction successful`);
  //       return newValue;
  //     } else {
  //       await this.redisUnwatch();
  //       this.logger.warn(
  //         `${taskName}: Job callback returned null, skipping update`,
  //       );
  //       return null;
  //     }
  //   } catch (error) {
  //     this.logger.error(
  //       `${taskName}: Error in optimistic lock: ${error.message}`,
  //       error.stack,
  //     );
  //     return null;
  //   }
  // }
  async optimisticLock<T>(
    taskName: string,
    key: string,
    jobCallback: (
      currentValue: T | null,
    ) => Promise<{ data: T; version: number }>,
    maxRetries: number = 3,
    attempt: number = 1,
  ): Promise<any | null> {
    try {
      this.logger.log(
        `${taskName}: Starting to watch key "${key}" (Attempt ${attempt})`,
      );

      await this.redisWatch(key);
      this.logger.log(`${taskName}: Successfully watching key "${key}"`);

      const rawData = (await this.redisGet(key)) || '{}';

      const result = await jobCallback(JSON.parse(rawData));

      if (!result) {
        await this.redisUnwatch();
        this.logger.warn(
          `${taskName}: Job callback returned null, skipping update.`,
        );
        return null;
      }

      const { version: newVersion, ...newValue } = result;
      this.logger.log(newVersion);
      this.logger.log(newValue);

      const latestData = JSON.parse((await this.redisGet(key)) || '{}');
      if (latestData.version !== newVersion) {
        this.logger.warn(
          `${taskName}: Version mismatch detected. Expected: ${newVersion}, Found: ${latestData.version}. Retrying...`,
        );

        if (attempt >= maxRetries) {
          this.logger.error(
            `${taskName}: Reached max retry attempts (${maxRetries}). Aborting.`,
          );
          return null;
        }
        return this.optimisticLock(
          taskName,
          key,
          jobCallback,
          maxRetries,
          attempt + 1,
        );
      }
      result.version += 1;
      const success = await this.redisExec(key, JSON.stringify(result));

      if (!success) {
        this.logger.warn(
          `${taskName}: Optimistic lock failed during Redis EXEC. Retrying...`,
        );
        if (attempt >= maxRetries) {
          this.logger.error(
            `${taskName}: Reached max retry attempts (${maxRetries}). Aborting.`,
          );
          return null;
        }
        return this.optimisticLock(
          taskName,
          key,
          jobCallback,
          maxRetries,
          attempt + 1,
        );
      }

      this.logger.log(`${taskName}: Transaction successful.`);
      return newValue;
    } catch (error) {
      this.logger.error(
        `${taskName}: Error in optimistic lock: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }
}
