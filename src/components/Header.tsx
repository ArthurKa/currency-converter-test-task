import { ObjEntries } from '@arthurka/ts-utils';
import styled from 'styled-components';
import { CurrencyCode } from '../types';
import { colors } from '../utils';

export interface HeaderProps {
  currencies: Record<CurrencyCode, number>;
}

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  background-color: ${colors.header};
  height: 40px;
`;
const CurrencyItem = styled.div`
  color: ${colors.main};
`;

export const Header: React.FC<HeaderProps> = ({ currencies }) => (
  <HeaderWrapper>
    {
      ObjEntries(currencies).map(([currency, value], i) => (
        <CurrencyItem key={i}>{`${currency}: ${value}`}</CurrencyItem>
      ))
    }
  </HeaderWrapper>
);
