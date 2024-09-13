"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBucketThrottler = void 0;
const log_1 = __importDefault(require("../log/log"));
/**
 * 令牌桶限流
 */
class TokenBucketThrottler {
    constructor(options) {
        this.tokens = 0;
        this.lastRefillTime = 0;
        this.capacity = 0;
        this.limit = options.limit || 60;
        this.lastRefillTime = Date.now();
        this.capacity = options.capacity || Math.floor(this.limit * 2); //默认最大容量是 limit 2 倍
        this.tokens = this.capacity;
    }
    /**
     * 生成令牌
     * @param now
     */
    refillToken(now) {
        let timePassed = (now - this.lastRefillTime) / 1000;
        // 计算经过时间后应该添加的令牌数量
        const tokensToAdd = Math.floor(timePassed * this.limit);
        log_1.default.debug(`throtter refillToken, timePassed:%d, limit:%d, tokensToAdd:%d`, timePassed, this.limit, tokensToAdd);
        if (tokensToAdd > 0) {
            this.lastRefillTime = now;
            this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
        }
    }
    /**
     * raw throttler, key generator by your self
     * @param option
     * @returns
     */
    async tryAcquire(option) {
        log_1.default.debug(`throtter tryAcquire, option:%s`, option);
        let now = Date.now();
        this.refillToken(now);
        //消耗令牌
        if (this.tokens >= 1) {
            this.tokens -= 1;
            return true;
        }
        else {
            return false;
        }
    }
    async destory() {
        log_1.default.info(`throtter call destory`);
    }
}
exports.TokenBucketThrottler = TokenBucketThrottler;
//# sourceMappingURL=token-bucket-throttler.js.map