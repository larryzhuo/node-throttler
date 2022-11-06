import { IThrottlerStorageOption } from '../interface';
import { IStorage } from './storage';
import logger from '../log/log';

/**
 * base on memory implement storage
 */
export class MemoryStorage implements IStorage {
  storage: Record<string, number[]> = {};
  private timeoutIds: NodeJS.Timeout[] = [];

  constructor(options: IThrottlerStorageOption) {
    logger.info('MemoryStorage options:%s', options);
  }

  async getRecordSize(key: string): Promise<number> {
    const records = await this.getRecord(key);
    return records.length;
  }

  async getRecord(key: string): Promise<number[]> {
    return this.storage[key] || [];
  }

  async addRecord(key: string, ttl: number): Promise<void> {
    logger.info('memory key=%s, ttl=%s', key, ttl);

    const ttlMilliseconds = ttl * 1000;
    if (!this.storage[key]) {
      this.storage[key] = [];
    }

    this.storage[key].push(Date.now() + ttlMilliseconds); // 队尾添加

    const timeoutId = setTimeout(() => {
      // 队头取出。 因为总是 Date.now() + ttlMilliseconds. 所以队头的永远是最早的请求。 队尾则是最近的请求。
      this.storage[key].shift(); // 过期释放，不用考虑请求是否返回的问题
      clearTimeout(timeoutId);
      this.timeoutIds = this.timeoutIds.filter((id) => id != timeoutId);
    }, ttlMilliseconds);
    this.timeoutIds.push(timeoutId);
  }

  async destory(): Promise<void> {
    this.timeoutIds.forEach((t) => clearTimeout(t));
  }
}
