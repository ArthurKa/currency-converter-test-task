import { ObjEntries, ObjFromEntries } from '@arthurka/ts-utils';
import fetch from 'node-fetch';
import { z } from 'zod';
import { CurrencyConverterProps } from '../components';
import { currencySchema, currencyNamesSchema } from '../schemas';
import { CurrencyCode } from '../types';
import { createCache } from '../utils';

const getCachedCurrencyNames = createCache<z.infer<typeof currencyNamesSchema>>();
export const getCurrencyNames = () => (
  getCachedCurrencyNames('', () => (
    fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
      .then(e => e.json())
      .then(currencyNamesSchema.parse)
  ))
);

const getCachedCurrency = createCache<z.infer<typeof currencySchema>>();
export const getCurrency = (currency: CurrencyCode) => (
  getCachedCurrency(currency, () => (
    fetch(`https://api.exchangerate.host/latest?base=${currency}`)
      .then(e => e.json())
      .then(currencySchema.parse)
  ))
);

export const getCurrencies = async (): Promise<CurrencyConverterProps['items']> => {
  const currencyNames = await getCurrencyNames();

  return ObjFromEntries(
    await Promise.all(
      ObjEntries(currencyNames).map(async ([currency, name]) => [
        currency,
        await getCurrency(currency).then(({ rates }) => ({ name, rates })),
      ]),
    ),
  );
};
