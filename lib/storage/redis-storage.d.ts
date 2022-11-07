import { IThrottlerStorageOption } from '../interface';
import { IStorage } from './storage';
export declare class RedisStorage implements IStorage {
    storage: Record<string, number[]>;
    private client;
    private timeoutIds;
    private config;
    constructor(options: IThrottlerStorageOption);
    getRecordSize(key: string): Promise<number>;
    getRecord(key: string): Promise<number[]>;
    addRecord(key: string, ttl: number): Promise<void>;
    destory(): Promise<void>;
}
