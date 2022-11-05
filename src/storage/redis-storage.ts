import { IThrottlerStorageOption } from '../interface';
import { IStorage } from './storage';

export class RedisStorage implements IStorage {
  storage: Record<string, number[]> = {};

  constructor(options: IThrottlerStorageOption) {
    console.log(options);
  }

  getRecord(key: string): Promise<number[]> {
    console.log(key);
    throw new Error('Method not implemented.');
  }

  addRecord(key: string, ttl: number): Promise<void> {
    console.log(key, ttl);
    throw new Error('Method not implemented.');
  }
}
