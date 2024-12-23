import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheRedisService {
  constructor(private readonly cacheManager: Cache) {}

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const options = ttl || undefined;
    await this.cacheManager.set(key, value, options); // cache-manager handles serialization
  }

  async get<T>(key: string): Promise<T | null> {
    return (await this.cacheManager.get<T>(key)) || null;
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
    await this.cacheManager.reset(); // Clear all cached entries
  }
}
