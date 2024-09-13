import { ILruMap, IThrottlerOption } from '../interface';
import logger from '../log/log';
import { TokenBucketThrottler } from './token-bucket-throttler';
const LruMap = require("collections/lru-map");

/**
 * 令牌桶限流工厂
 * 支持 lru cach
 */
export class TokenBucketThrottlerFactory {
  lruMap:ILruMap<TokenBucketThrottler>;
  options: IThrottlerOption;

  constructor(opts: IThrottlerOption) {
    this.lruMap = new LruMap({}, opts.lruLimitSize || 200);
    this.options = opts;
  }

  public getThrottler(key: string): TokenBucketThrottler {
    logger.debug(`getThrottler, key:%s`, this.lruMap.length);
    let throttler = this.lruMap.get(key);
    if (throttler) {
      return throttler;
    } 
    throttler = new TokenBucketThrottler(this.options);
    this.lruMap.set(key, throttler);
    return throttler;
 }

  async destory(): Promise<void> {
    if(this.lruMap) {
      this.lruMap.clear();
    }
  }
}
