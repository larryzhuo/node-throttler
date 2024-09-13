import { IThrottlerOption, StorageTypeEnum } from '../interface';
import { IAcquireOption, IThrottler } from './throttler';
import logger from '../log/log';

/**
 * 令牌桶限流
 */
export class TokenBucketThrottler implements IThrottler {
  private limit: number;    //每 s 生成令牌数
  private tokens: number = 0;
  private lastRefillTime:number = 0;
  private capacity: number = 0;

  constructor(options: IThrottlerOption) {
    this.limit = options.limit || 60;
    this.lastRefillTime = Date.now();
    this.capacity = options.capacity || Math.floor(this.limit * 2); //默认最大容量是 limit 2 倍
    this.tokens = this.capacity;
  }

  /**
   * 生成令牌
   * @param now 
   */
  private refillToken(now: number) {
    let timePassed = (now - this.lastRefillTime) / 1000;
    // 计算经过时间后应该添加的令牌数量
    const tokensToAdd = Math.floor(timePassed * this.limit);
    logger.debug(`throtter refillToken, timePassed:%d, limit:%d, tokensToAdd:%d`, timePassed, this.limit, tokensToAdd);
    if(tokensToAdd > 0) {
      this.lastRefillTime = now;
      this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    }
  }

  /**
   * raw throttler, key generator by your self
   * @param option
   * @returns
   */
  async tryAcquire(option: IAcquireOption): Promise<boolean> {
    logger.debug(`throtter tryAcquire, option:%s`, option);
    let now = Date.now();
    this.refillToken(now);
    //消耗令牌
    if(this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    } else {
      return false;
    }
  }

  async destory(): Promise<void> {
    logger.info(`throtter call destory`);
  }
}
