import { IThrottlerStorageOption } from '../interface';
import { IStorage } from './storage';
/**
 * base on memory implement storage
 */
export declare class MemoryStorage implements IStorage {
    storage: Record<string, number[]>;
    private timeoutIds;
    constructor(options: IThrottlerStorageOption);
    getRecordSize(key: string): Promise<number>;
    getRecord(key: string): Promise<number[]>;
    addRecord(key: string, ttl: number): Promise<void>;
    destory(): Promise<void>;
}
