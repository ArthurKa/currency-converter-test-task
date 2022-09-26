import { ObjEntries } from '@arthurka/ts-utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CurrencyCode } from '../types';

export interface CurrencyItemProps {
  amount: number;
  setAmount(newValue: number): void;
  currency: CurrencyCode;
  setCurrency(newCurrency: CurrencyCode): void;
  currencyOptions: Record<CurrencyCode, string>;
}

const CurrencyItemWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
`;
const CurrencySelect = styled.select`
  text-align: center;
`;
const CurrencyInput = styled.input`
  text-align: center;
  width: 100%;
`;

export const CurrencyItem: React.FC<CurrencyItemProps> = ({
  amount,
  setAmount: _setAmount,
  currency,
  setCurrency,
  currencyOptions,
}) => {
  const lastInnerAmount = useRef<string>('');
  const amountRef = useRef<HTMLInputElement>(null);
  const [innerAmount, setInnerAmount] = useState<string>(String(amount));
  const isAmountFocused = useRef(false);

  type S = Parameters<typeof preprocessAmountKeyDown>[0]['currentTarget'];
  const lastSelection = useRef<[S['selectionStart'], S['selectionEnd']]>([null, null]);

  const lastAmount = useRef(amount);
  useEffect(() => {
    if(isAmountFocused.current || lastAmount.current === amount) {
      return;
    }

    lastAmount.current = amount;
    setInnerAmount(String(amount));
  }, [amount]);

  const setAmount = useCallback((newRawAmount: string, newAmount = +newRawAmount) => {
    setInnerAmount(newRawAmount);
    _setAmount(newAmount);
  }, [_setAmount]);

  const preprocessAmountKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value, selectionStart, selectionEnd } = e.currentTarget;
    lastInnerAmount.current = value;
    lastSelection.current = [selectionStart, selectionEnd];
  }, []);
  const preprocessAmountChange = useCallback((e: { currentTarget: { value: string } }) => {
    const value = e.currentTarget.value.replace(',', '.').replace(/(\.\d{2}).*$/, '$1');
    const newAmount = +value;

    if(!Number.isFinite(newAmount)) {
      const { current } = lastInnerAmount;
      setAmount(current);

      setTimeout(() => {
        const { current } = amountRef;

        if(!current) {
          throw new Error('This should never happen. 455fq1');
        }

        [current.selectionStart, current.selectionEnd] = lastSelection.current;
      }, 0);

      return;
    }
    if(newAmount < 0) {
      return void setAmount('0');
    }

    setAmount(value, newAmount);
  }, [setAmount]);

  const preprocessAmountFocus = useCallback(() => {
    isAmountFocused.current = true;
  }, []);
  const preprocessAmountBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setInnerAmount(String(+innerAmount));
    isAmountFocused.current = false;
    preprocessAmountChange(e);
  }, [innerAmount, preprocessAmountChange]);

  const preprocessChangeCurrency = useCallback((e: { currentTarget: { value: string } }) => {
    setCurrency(CurrencyCode(e.currentTarget.value));
  }, [setCurrency]);

  return (
    <CurrencyItemWrapper>
      <CurrencyInput {...{
        ref: amountRef,
        value: innerAmount,
        onKeyDown: preprocessAmountKeyDown,
        onChange: preprocessAmountChange,
        onFocus: preprocessAmountFocus,
        onBlur: preprocessAmountBlur,
        tabIndex: 1,
      }}
      />
      <CurrencySelect {...{
        value: currency,
        onChange: preprocessChangeCurrency,
        tabIndex: 2,
      }}
      >
        {
          ObjEntries(currencyOptions).map(([value, name], i) => (
            <option key={i} {...{ value }}>{name}</option>
          ))
        }
      </CurrencySelect>
    </CurrencyItemWrapper>
  );
};
