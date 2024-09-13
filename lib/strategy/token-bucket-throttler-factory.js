"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBucketThrottlerFactory = void 0;
const log_1 = __importDefault(require("../log/log"));
const token_bucket_throttler_1 = require("./token-bucket-throttler");
const LruMap = require("collections/lru-map");
/**
 * 令牌桶限流工厂
 * 支持 lru cach
 */
class TokenBucketThrottlerFactory {
    constructor(opts) {
        this.lruMap = new LruMap({}, opts.lruLimitSize || 200);
        this.options = opts;
    }
    getThrottler(key) {
        log_1.default.debug(`getThrottler, key:%s`, this.lruMap.length);
        let throttler = this.lruMap.get(key);
        if (throttler) {
            return throttler;
        }
        throttler = new token_bucket_throttler_1.TokenBucketThrottler(this.options);
        this.lruMap.set(key, throttler);
        return throttler;
    }
    async destory() {
        log_1.default.info(`throtter call destory`);
    }
}
exports.TokenBucketThrottlerFactory = TokenBucketThrottlerFactory;
//# sourceMappingURL=token-bucket-throttler-factory.js.map