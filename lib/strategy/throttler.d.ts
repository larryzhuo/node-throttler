export interface IAcquireOption {
    key: string;
}
export interface IThrottler {
    /**
     * acquire token
     * if reach limit, return false;
     * else if not reach limit, return true;
     */
    tryAcquire: (option: IAcquireOption) => Promise<boolean>;
    /**
     * destory throttler
     */
    destory: () => Promise<void>;
}
