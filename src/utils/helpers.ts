import { ObjEntries, ObjFromEntries, round } from '@arthurka/ts-utils';
import type { getCurrencies } from '../services';
import type { HeaderProps } from '../components/Header';
import { CurrencyCode } from '../types';

type Entry = readonly [string, ...unknown[]];

export const sortCurrencies = (currencyOrder: string[]) => (a: Entry, b: Entry) => (
  currencyOrder.indexOf(a[0]) - currencyOrder.indexOf(b[0])
);

export const preprocessHeaderProps = (currencies: Awaited<ReturnType<typeof getCurrencies>>): HeaderProps => {
  const currenciesToPick = ['USD', 'EUR'];

  return {
    currencies: ObjFromEntries(
      ObjEntries(currencies)
        .filter(e => currenciesToPick.includes(e[0]))
        .sort(sortCurrencies(currenciesToPick))
        .map(([currency, { rates }]) => [currency, rates[CurrencyCode('UAH')] ?? 0]),
    ),
  };
};

export const returnIfNotUndefined = <T>(e: T, errorMessage: string): T extends undefined ? never : T => {
  if(e === void 0) {
    throw new Error(errorMessage);
  }

  return e as any;
};

export const countExchange = (amount: number, rate: number) => round(amount * rate, 2);
