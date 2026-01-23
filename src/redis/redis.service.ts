import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client = new Redis();
  onModuleInit() {
    this.client = new Redis({ host: 'localhost' });
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
