"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisStorage = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const log_1 = __importDefault(require("../log/log"));
const node_assert_1 = __importDefault(require("node:assert"));
class RedisStorage {
    constructor(options) {
        this.storage = {};
        this.timeoutIds = [];
        log_1.default.info('RedisStorage options:%s', options);
        const config = options.options;
        if (!config) {
            throw new Error(`RedisStorage redisOptions is required`);
        }
        this.config = config;
        if (config.cluster === true) {
            log_1.default.info('[throttler] cluster connecting');
            (0, node_assert_1.default)(config.nodes && config.nodes.length !== 0, '[throttler] cluster nodes configuration is required when use cluster redis');
            this.client = new ioredis_1.default.Cluster(config.nodes || [], config);
        }
        else if (config.sentinels) {
            log_1.default.info('[throttler] sentinel connecting start');
            this.client = new ioredis_1.default(config);
        }
        else {
            log_1.default.info('[throttler] server connecting redis://:***@%s:%s/%s', config.host, config.port);
            this.client = new ioredis_1.default(config);
        }
        this.client.on('connect', () => {
            log_1.default.info('[throttler] client connect success');
        });
        this.client.on('error', (err) => {
            log_1.default.error('[throttler] client error: %s', err);
            log_1.default.error(err);
        });
    }
    async getRecordSize(key) {
        return await this.client.llen(key);
    }
    async getRecord(key) {
        const sarr = await this.client.lrange(key, 0, -1);
        return sarr.map((s) => parseInt(s));
    }
    async addRecord(key, ttl) {
        log_1.default.info('redis key=%s, ttl=%s', key, ttl);
        const ttlMilliseconds = ttl * 1000;
        await this.client.rpush(key, Date.now() + ttlMilliseconds);
        await this.client.expire(key, this.config.ttl || 60); // refresh expire
        const timeoutId = setTimeout(async () => {
            await this.client.lpop(key);
            clearTimeout(timeoutId);
            this.timeoutIds = this.timeoutIds.filter((id) => id != timeoutId);
        }, ttlMilliseconds);
    }
    async destory() {
        this.timeoutIds.forEach((t) => clearTimeout(t));
        if (this.client) {
            await this.client.disconnect();
        }
    }
}
exports.RedisStorage = RedisStorage;
//# sourceMappingURL=redis-storage.js.map