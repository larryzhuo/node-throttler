import { IThrottlerOption, StorageTypeEnum } from '../interface';
import { IStorage } from '../storage/storage';
import { StorageFactory } from '../storage/storage-factory';
import { IThrottler } from './throttler';
import logger from '../log/log';

/**
 * counter throttle algorithm
 */
export class CounterThrottler implements IThrottler {
  private _storage?: IStorage;
  private limit: number;
  private ttl: number;
  private _count = 0;
  private _timer?: NodeJS.Timer;

  constructor(options: IThrottlerOption) {
    // default memory storage
    options.storage = options.storage || { type: StorageTypeEnum.memory };
    this.limit = options.limit || 60;
    // ms
    this.ttl = options.ttl || 1000;

    if (!this._storage) {
      this._storage = StorageFactory.getStorage(options.storage);
    }

    this.startResetCounterTimer();
  }

  private startResetCounterTimer() {
    this._timer = setInterval(() => {
      this._count = 0;
    }, this.ttl);
  }

  tryAcquire(): boolean {
    throw new Error('Method not implemented.');
  }

  destory(): void {
    if (this._timer) {
      clearInterval(this._timer);
      logger.info(`timer destory`);
    }
  }
}
