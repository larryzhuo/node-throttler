import { ILruMap, IThrottlerOption } from '../interface';
import { TokenBucketThrottler } from './token-bucket-throttler';
/**
 * 令牌桶限流工厂
 * 支持 lru cach
 */
export declare class TokenBucketThrottlerFactory {
    lruMap: ILruMap<TokenBucketThrottler>;
    options: IThrottlerOption;
    constructor(opts: IThrottlerOption);
    getThrottler(key: string): TokenBucketThrottler;
    destory(): void;
}
