import { RedisOptions } from 'ioredis';

export enum StorageTypeEnum {
  memory = 'memory',
  redis = 'redis',
}

export interface IThrottlerStorageOption {
  type: StorageTypeEnum;
  options?: RedisOptions;
}

export interface IThrottlerOption {
  /**
   * The amount of requests that are allowed within the ttl's time window.
   */
  limit?: number;

  /**
   * The amount of seconds of how many requests are allowed within this time.
   */
  ttl?: number;

  /**
   * The storage class to use where all the record will be stored in.
   */
  storage?: IThrottlerStorageOption;
}
