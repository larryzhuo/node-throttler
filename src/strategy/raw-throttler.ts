import { IThrottlerOption, StorageTypeEnum } from '../interface';
import { IStorage } from '../storage/storage';
import { StorageFactory } from '../storage/storage-factory';
import { IAcquireOption, IThrottler } from './throttler';
import logger from '../log/log';

/**
 * a raw throttler
 */
export class RawThrottler implements IThrottler {
  private _storage: IStorage;
  private limit: number;
  private ttl: number;

  constructor(options: IThrottlerOption) {
    // default memory storage
    options.storage = options.storage || { type: StorageTypeEnum.memory };
    this.limit = options.limit || 60;
    // seconds
    this.ttl = options.ttl || 1;
    // select a storage
    this._storage = StorageFactory.getStorage(options.storage);
  }

  /**
   * raw throttler, key generator by your self
   * @param option
   * @returns
   */
  async tryAcquire(option: IAcquireOption): Promise<boolean> {
    const { key } = option;
    if (!key) {
      throw new Error('key is required');
    }
    const records = await this._storage.getRecord(key);
    if (records.length >= this.limit) {
      // reach limit
      return false;
    }

    // add record
    await this._storage.addRecord(key, this.ttl);

    return true;
  }

  async destory(): Promise<void> {
    logger.info(`throtter call destory`);
    if (this._storage) {
      await this._storage.destory();
    }
  }
}
