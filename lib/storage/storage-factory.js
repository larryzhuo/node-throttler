"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageFactory = void 0;
const interface_1 = require("../interface");
const memory_storage_1 = require("./memory-storage");
const redis_storage_1 = require("./redis-storage");
class StorageFactory {
    /**
     * create storage by type
     */
    static getStorage(options) {
        const { type } = options;
        if (type == interface_1.StorageTypeEnum.memory) {
            return new memory_storage_1.MemoryStorage(options);
        }
        else if (type == interface_1.StorageTypeEnum.redis) {
            return new redis_storage_1.RedisStorage(options);
        }
        else {
            throw Error(`unsupport storage type, ${type}`);
        }
    }
}
exports.StorageFactory = StorageFactory;
//# sourceMappingURL=storage-factory.js.map