export interface IThrottler {
  /**
   * implement acquire token
   */
  tryAcquire: () => boolean;

  /**
   * destory throttler
   */
  destory: () => void;
}
