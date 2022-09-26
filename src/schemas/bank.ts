import { ObjEntries, ObjFromEntries, ObjKeys } from '@arthurka/ts-utils';
import { z } from 'zod';
import { CurrencyCode, isCurrencyCode } from '../types';
import { sortCurrencies } from '../utils';

export const currenciesToPick: Record<CurrencyCode, boolean> = {
  [CurrencyCode('UAH')]: true,
  [CurrencyCode('USD')]: true,
  [CurrencyCode('EUR')]: true,
  [CurrencyCode('GBP')]: true,
  [CurrencyCode('PLN')]: true,
  [CurrencyCode('FRF')]: true,
  [CurrencyCode('AUD')]: true,
  [CurrencyCode('CAD')]: true,
  [CurrencyCode('GEL')]: true,
};

export const currencyNamesSchema = (
  z.array(
    z.object({
      txt: z.string().min(1),
      cc: z.custom<CurrencyCode>(isCurrencyCode),
    }),
  )
    .transform(e => e.reduce<Record<CurrencyCode, string>>((acc, { cc, txt }) => ({
      ...acc,
      ...currenciesToPick[cc] && {
        [cc]: txt,
      },
    }), {}))
    .transform(({ ...e }) => {
      e[CurrencyCode('UAH')] = 'Українська гривня';

      const currencyOrder = ObjKeys(currenciesToPick);

      return ObjFromEntries(
        ObjEntries(e).sort(sortCurrencies(currencyOrder)),
      );
    })
);
