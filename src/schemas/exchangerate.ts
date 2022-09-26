import { NonUndefined, ObjEntries, ObjFromEntries, ObjKeys } from '@arthurka/ts-utils';
import { z } from 'zod';
import { CurrencyCode, isCurrencyCode } from '../types';
import { sortCurrencies } from '../utils';
import { currenciesToPick } from './bank';

export const currencySchema = (
  z.object({
    base: z.custom<CurrencyCode>(isCurrencyCode),
    date: z.string().regex(/\d{4}(-\d{2}){2}/),
    rates: z.record(z.custom<CurrencyCode>(isCurrencyCode), z.number()).transform(e => {
      const currencyOrder = ObjKeys(currenciesToPick);

      return ObjFromEntries(
        ObjEntries(e)
          .filter(e => currencyOrder.includes(e[0]))
          .filter((e): e is [typeof e[0], NonUndefined<typeof e[1]>] => e[1] !== void 0)
          .sort(sortCurrencies(currencyOrder)),
      );
    }),
  })
);
