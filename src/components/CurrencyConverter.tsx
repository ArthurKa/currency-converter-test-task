import { ObjEntries, ObjFromEntries } from '@arthurka/ts-utils';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { CurrencyCode } from '../types';
import { countExchange } from '../utils';
import { CurrencyItem } from './CurrencyItem';

export interface CurrencyConverterProps {
  items: Record<CurrencyCode, {
    name: string;
    rates: Record<CurrencyCode, number>;
  }>;
  defaultAmounts: {
    first: number;
    second: number;
  };
  defaultCurrencies: {
    first: CurrencyCode;
    second: CurrencyCode;
  };
}

const CurrencyConverterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ items, defaultAmounts, defaultCurrencies }) => {
  const itemEntries = useMemo(() => ObjEntries(items), [items]);
  const currencyOptions = useMemo(() => (
    ObjFromEntries(itemEntries.map(([key, val]) => [key, val.name]))
  ), [itemEntries]);

  const [firstAmount, setFirstAmount] = useState(defaultAmounts.first);
  const [secondAmount, setSecondAmount] = useState(defaultAmounts.second);
  const [firstCurrency, setFirstCurrency] = useState(defaultCurrencies.first);
  const [secondCurrency, setSecondCurrency] = useState(defaultCurrencies.second);

  const preprocessSet = useCallback(({
    mainAmount,
    mainCurrency,
    dependentCurrency,
    setMainAmount,
    setMainCurrency,
    setDependentAmount,
    setDependentCurrency,
  }: {
    mainAmount: number;
    mainCurrency: CurrencyCode;
    dependentCurrency: CurrencyCode;
    setMainAmount(e: number): void;
    setMainCurrency(e: CurrencyCode): void;
    setDependentAmount(e: number): void;
    setDependentCurrency(e: CurrencyCode): void;
  }) => {
    const rate = items[mainCurrency]?.rates[dependentCurrency];

    if(rate === void 0) {
      throw new Error('This should never happen. u6h6cl');
    }

    const dependentAmount = countExchange(mainAmount, rate);

    setMainAmount(mainAmount);
    setMainCurrency(mainCurrency);
    setDependentAmount(dependentAmount);
    setDependentCurrency(dependentCurrency);
  }, [items]);

  const preprocessedSetFirstAmount = useCallback((newAmount: number) => {
    preprocessSet({
      mainAmount: newAmount,
      mainCurrency: firstCurrency,
      dependentCurrency: secondCurrency,
      setMainAmount: setFirstAmount,
      setMainCurrency: setFirstCurrency,
      setDependentAmount: setSecondAmount,
      setDependentCurrency: setSecondCurrency,
    });
  }, [firstCurrency, preprocessSet, secondCurrency]);
  const preprocessedSetSecondAmount = useCallback((newAmount: number) => {
    preprocessSet({
      mainAmount: newAmount,
      mainCurrency: secondCurrency,
      dependentCurrency: firstCurrency,
      setMainAmount: setSecondAmount,
      setMainCurrency: setSecondCurrency,
      setDependentAmount: setFirstAmount,
      setDependentCurrency: setFirstCurrency,
    });
  }, [firstCurrency, preprocessSet, secondCurrency]);

  const preprocessedSetFirstCurrency = useCallback((newCurrency: CurrencyCode) => {
    preprocessSet({
      mainAmount: firstAmount,
      mainCurrency: newCurrency,
      dependentCurrency: secondCurrency,
      setMainAmount: setFirstAmount,
      setMainCurrency: setFirstCurrency,
      setDependentAmount: setSecondAmount,
      setDependentCurrency: setSecondCurrency,
    });
  }, [firstAmount, preprocessSet, secondCurrency]);
  const preprocessedSetSecondCurrency = useCallback((newCurrency: CurrencyCode) => {
    preprocessSet({
      mainAmount: firstAmount,
      mainCurrency: firstCurrency,
      dependentCurrency: newCurrency,
      setMainAmount: setFirstAmount,
      setMainCurrency: setFirstCurrency,
      setDependentAmount: setSecondAmount,
      setDependentCurrency: setSecondCurrency,
    });
  }, [firstAmount, firstCurrency, preprocessSet]);

  return (
    <CurrencyConverterWrapper>
      <CurrencyItem {...{
        amount: firstAmount,
        setAmount: preprocessedSetFirstAmount,
        currency: firstCurrency,
        setCurrency: preprocessedSetFirstCurrency,
        currencyOptions,
      }}
      />
      🡆
      <CurrencyItem {...{
        amount: secondAmount,
        setAmount: preprocessedSetSecondAmount,
        currency: secondCurrency,
        setCurrency: preprocessedSetSecondCurrency,
        currencyOptions,
      }}
      />
    </CurrencyConverterWrapper>
  );
};
