import { IAcquireOption, RawThrottler, StorageTypeEnum, TokenBucketThrottler, TokenBucketThrottlerFactory } from '../src/index';

async function sleep(time) {
  return new Promise((resolve: any) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

jest.setTimeout(60 * 1000);

describe('token bucket throttler', () => {
  /**
   * test memory storage
   */
  test('test tokenbucket storage', async () => {

    //工厂
    let factory = new TokenBucketThrottlerFactory({
      lruLimitSize:50,
      limit: 10,
      capacity: 11,
    });

    for(let i=1; i<=200; i++) {
      let key = `test-key-${i}`;

      let throtter = factory.getThrottler(key,);

      let ret = await throtter.tryAcquire({key:key});
      console.log(`${key} 拿 token 结果:${ret}`);
    }

    await sleep(2000);
    
    //针对其中一个 key，再尝试并发请求 20 次
    for(let i=0; i<20; i++){
      let key = `test-key-1`;
      let throtter = factory.getThrottler(key);
      let ret = await throtter.tryAcquire({key:key});
      console.log(`${key} 单 key 拿 token 结果:${ret}`);
    }

    await sleep(500);

    for(let i=0; i<10; i++){
      let key = `test-key-1`;
      let throtter = factory.getThrottler(key);
      let ret = await throtter.tryAcquire({key:key});
      console.log(`${key} 静默 500ms 后拿 token 结果:${ret}`); }


    console.log('tokenbucket storage');
  });


});
