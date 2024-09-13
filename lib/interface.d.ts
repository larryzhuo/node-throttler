import { ClusterNode, RedisOptions } from 'ioredis';
export declare enum StorageTypeEnum {
    memory = "memory",
    redis = "redis",
    tokenBucket = "tokenBucket"
}
export interface IThrottlerStorageOption {
    type: StorageTypeEnum;
    options?: IRedisOption;
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
    lruLimitSize?: number;
    /**
     * 最大瞬间请求量
     */
    capacity?: number;
    /**
     * The storage class to use where all the record will be stored in.
     */
    storage?: IThrottlerStorageOption;
}
export interface IRedisClusterOption {
    cluster?: boolean;
    nodes?: ClusterNode[];
}
export interface IRedisOption extends RedisOptions, IRedisClusterOption {
    ttl?: number;
    capacity?: number;
    tokensPerInterval?: number;
}
export interface ILruMap<T> {
    length: number;
    get(key: string): T;
    set(key: string, v: T): boolean;
    clear(): void;
}
