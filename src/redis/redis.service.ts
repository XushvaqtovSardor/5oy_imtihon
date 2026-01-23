import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    const host = this.config.get('REDIS_HOST') || 'localhost';
    const port = this.config.get('REDIS_PORT') || 6379;
    
    this.client = new Redis({
      host,
      port: Number(port),
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      lazyConnect: false,
      showFriendlyErrorStack: true,
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err.message);
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
    });
  }
  async set(key: string, code: string, second: number) {
    await this.client.set(key, code, 'EX', second);
  }
  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }
  async del(key: string) {
    await this.client.del(key);
  }
  async getAllKeys() {
    await this.client.keys('*');
  }
  async getTTL(key: string): Promise<number> {
    return await this.client.ttl(key);
  }
}
