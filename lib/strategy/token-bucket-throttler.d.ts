import { IThrottlerOption } from '../interface';
import { IAcquireOption, IThrottler } from './throttler';
/**
 * 令牌桶限流
 */
export declare class TokenBucketThrottler implements IThrottler {
    private limit;
    private tokens;
    private lastRefillTime;
    private capacity;
    constructor(options: IThrottlerOption);
    /**
     * 生成令牌
     * @param now
     */
    private refillToken;
    /**
     * raw throttler, key generator by your self
     * @param option
     * @returns
     */
    tryAcquire(option: IAcquireOption): Promise<boolean>;
    destory(): Promise<void>;
}
