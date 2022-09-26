import { Brand, WITNESS } from '@arthurka/ts-utils';
import { initializeByTypeGuard } from '../utils';

/**
  Currency code.

  @example
  'UAH', 'USD', 'EUR'.
*/
export type CurrencyCode = Brand<string, 'currency code'>;
export const isCurrencyCode = (e: unknown): e is CurrencyCode => (
  true
    && typeof e === 'string'
    && e.length === 3
    && e.toUpperCase() === e
);
export const CurrencyCode = (e: CurrencyCode[WITNESS]): CurrencyCode => (
  initializeByTypeGuard(e, isCurrencyCode, 'CurrencyCode')
);
