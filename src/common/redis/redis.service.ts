import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import CryptoJS from 'crypto-js';
import { host, port, prefix, prefixUser, secretKey } from '@/config/redis';
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public client: Redis;
  public prefix: string = prefix;
  public prefixUser: string = prefixUser;

  constructor() {
    this.client = new Redis({
      host: host,
      port: port || 6379,
    });
  }

  async onModuleInit() {
    await this.client.ping(() => console.log('✅ Redis is ready!'));
  }

  async onModuleDestroy() {
    await this.client.quit(); // Đóng kết nối khi module bị destroy
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const fullKey = this.prefix + ':' + key;
    const stringValue = JSON.stringify(value);
    let result;
    if (ttl) {
      result = await this.client.set(fullKey, stringValue, 'EX', ttl); // TTL = Time To Live
    } else {
      result = await this.client.set(fullKey, stringValue);
    }
    if (result !== 'OK') throw new Error('Redis SET failed');
  }

  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.prefix + ':' + key;
    const data = await this.client.get(fullKey);
    return data ? JSON.parse(data) : null;
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async encryptToken(token: string): Promise<string> {
    return CryptoJS.AES.encrypt(token, secretKey).toString();
  }

  async decryptToken(encryptedToken: any): Promise<string> {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
