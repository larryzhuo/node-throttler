import { IThrottlerStorageOption, StorageTypeEnum } from '../interface';
import { MemoryStorage } from './memory-storage';
import { RedisStorage } from './redis-storage';
import { IStorage } from './storage';

export class StorageFactory {
  /**
   * create storage by type
   */
  static getStorage(options: IThrottlerStorageOption): IStorage {
    const { type } = options;
    if (type == StorageTypeEnum.memory) {
      return new MemoryStorage(options);
    } else if (type == StorageTypeEnum.redis) {
      return new RedisStorage(options);
    } else {
      throw Error(`unsupport storage type, ${type}`);
    }
  }
}
