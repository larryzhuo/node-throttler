import Redis, { Cluster } from 'ioredis';
import { IRedisOption, IThrottlerStorageOption } from '../interface';
import { IStorage } from './storage';
import logger from '../log/log';
import assert from 'node:assert';

export class RedisStorage implements IStorage {
  storage: Record<string, number[]> = {};
  private client: Cluster | Redis;
  private timeoutIds: NodeJS.Timeout[] = [];
  private config: IRedisOption;

  constructor(options: IThrottlerStorageOption) {
    logger.info('RedisStorage options:%s', options);

    const config = options.options as IRedisOption;
    if (!config) {
      throw new Error(`RedisStorage redisOptions is required`);
    }
    this.config = config;

    if (config.cluster === true) {
      logger.info('[throttler] cluster connecting');
      assert(
        config.nodes && config.nodes.length !== 0,
        '[throttler] cluster nodes configuration is required when use cluster redis',
      );
      this.client = new Redis.Cluster(config.nodes || [], config);
    } else if (config.sentinels) {
      logger.info('[throttler] sentinel connecting start');
      this.client = new Redis(config);
    } else {
      logger.info('[throttler] server connecting redis://:***@%s:%s/%s', config.host, config.port);
      this.client = new Redis(config);
    }

    this.client.on('connect', () => {
      logger.info('[throttler] client connect success');
    });
    this.client.on('error', (err) => {
      logger.error('[throttler] client error: %s', err);
      logger.error(err);
    });
  }

  async getRecordSize(key: string): Promise<number> {
    return await this.client.llen(key);
  }

  async getRecord(key: string): Promise<number[]> {
    const sarr = await this.client.lrange(key, 0, -1);
    return sarr.map((s) => parseInt(s));
  }

  async addRecord(key: string, ttl: number): Promise<void> {
    logger.info('redis key=%s, ttl=%s', key, ttl);

    const ttlMilliseconds = ttl * 1000;

    await this.client.rpush(key, Date.now() + ttlMilliseconds);
    await this.client.expire(key, this.config.ttl || 60); // refresh expire

    const timeoutId = setTimeout(async () => {
      await this.client.lpop(key);
      clearTimeout(timeoutId);
      this.timeoutIds = this.timeoutIds.filter((id) => id != timeoutId);
    }, ttlMilliseconds);
  }

  async destory(): Promise<void> {
    this.timeoutIds.forEach((t) => clearTimeout(t));
    if (this.client) {
      await this.client.disconnect();
    }
  }
}
