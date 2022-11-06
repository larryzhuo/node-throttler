"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStorage = void 0;
const log_1 = __importDefault(require("../log/log"));
/**
 * base on memory implement storage
 */
class MemoryStorage {
    constructor(options) {
        this.storage = {};
        this.timeoutIds = [];
        log_1.default.info('MemoryStorage options:%s', options);
    }
    async getRecordSize(key) {
        const records = await this.getRecord(key);
        return records.length;
    }
    async getRecord(key) {
        return this.storage[key] || [];
    }
    async addRecord(key, ttl) {
        log_1.default.info('memory key=%s, ttl=%s', key, ttl);
        const ttlMilliseconds = ttl * 1000;
        if (!this.storage[key]) {
            this.storage[key] = [];
        }
        this.storage[key].push(Date.now() + ttlMilliseconds); // 队尾添加
        const timeoutId = setTimeout(() => {
            // 队头取出。 因为总是 Date.now() + ttlMilliseconds. 所以队头的永远是最早的请求。 队尾则是最近的请求。
            this.storage[key].shift(); // 过期释放，不用考虑请求是否返回的问题
            clearTimeout(timeoutId);
            this.timeoutIds = this.timeoutIds.filter((id) => id != timeoutId);
        }, ttlMilliseconds);
        this.timeoutIds.push(timeoutId);
    }
    async destory() {
        this.timeoutIds.forEach((t) => clearTimeout(t));
    }
}
exports.MemoryStorage = MemoryStorage;
//# sourceMappingURL=memory-storage.js.map