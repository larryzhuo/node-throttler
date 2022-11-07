import { IThrottlerStorageOption } from '../interface';
import { IStorage } from './storage';
export declare class StorageFactory {
    /**
     * create storage by type
     */
    static getStorage(options: IThrottlerStorageOption): IStorage;
}
