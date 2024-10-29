import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheInterface } from '../cache.interface';

@Injectable()
export class RedisCacheRepository implements CacheInterface {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', 60);
  }
  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }
  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
