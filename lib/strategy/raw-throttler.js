"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawThrottler = void 0;
const interface_1 = require("../interface");
const storage_factory_1 = require("../storage/storage-factory");
const log_1 = __importDefault(require("../log/log"));
/**
 * a raw throttler
 */
class RawThrottler {
    constructor(options) {
        // default memory storage
        options.storage = options.storage || { type: interface_1.StorageTypeEnum.memory };
        this.limit = options.limit || 60;
        // seconds
        this.ttl = options.ttl || 1;
        // select a storage
        this._storage = storage_factory_1.StorageFactory.getStorage(options.storage);
    }
    /**
     * raw throttler, key generator by your self
     * @param option
     * @returns
     */
    async tryAcquire(option) {
        const { key } = option;
        if (!key) {
            throw new Error('key is required');
        }
        const records = await this._storage.getRecord(key);
        if (records.length >= this.limit) {
            // reach limit
            return false;
        }
        // add record
        await this._storage.addRecord(key, this.ttl);
        return true;
    }
    async destory() {
        if (this._timer) {
            clearInterval(this._timer);
            log_1.default.info(`timer destory`);
        }
        if (this._storage) {
            await this._storage.destory();
        }
    }
}
exports.RawThrottler = RawThrottler;
//# sourceMappingURL=raw-throttler.js.map