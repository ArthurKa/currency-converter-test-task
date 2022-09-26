import { Seconds } from '../types';

type IsInappropriateParameter<T> = undefined extends T ? true : false;

class CannotCache<T> {
  private cannotCache!: T;
}

export const createCache = (
  <T extends IsInappropriateParameter<T> extends true ? CannotCache<T> : unknown>(
    cachingTime: Seconds = 20,
  ) => {
    const cacheObject: Record<string, T> = {};
    let time: number | null = null;

    return async (cacheKey: string, cb: () => Promise<T>) => {
      const now = Date.now();

      if(time === null || now - time < cachingTime * 1000) {
        const cachedValue = cacheObject[cacheKey];

        if(cachedValue !== void 0) {
          return cachedValue;
        }
      }

      const value = await cb();
      cacheObject[cacheKey] = value;
      time = now;

      return value;
    };
  }
);
