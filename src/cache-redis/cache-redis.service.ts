import Redis from 'ioredis';

export class CacheRedisService {
  constructor(private readonly client: Redis) {}

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const serializedValue = JSON.stringify(value);
    if (ttl) {
      await this.client.set(key, serializedValue, 'EX', ttl); // Set with TTL
    } else {
      await this.client.set(key, serializedValue); // Set without TTL
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) {
      return null;
    }
    try {
      return JSON.parse(data) as T; // Parse and return the object
    } catch (error) {
      console.error(`Failed to parse cache key ${key}:`, error);
      return null; // Return null if parsing fails
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
