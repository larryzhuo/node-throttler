import { IThrottlerOption } from '../interface';
import { IAcquireOption, IThrottler } from './throttler';
/**
 * a raw throttler
 */
export declare class RawThrottler implements IThrottler {
    private _storage;
    private limit;
    private ttl;
    constructor(options: IThrottlerOption);
    /**
     * raw throttler, key generator by your self
     * @param option
     * @returns
     */
    tryAcquire(option: IAcquireOption): Promise<boolean>;
    destory(): Promise<void>;
}
