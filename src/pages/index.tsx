import Head from 'next/head';
import type { NextPage, GetServerSideProps } from 'next';
import { ObjEntries } from '@arthurka/ts-utils';
import {
  Header,
  HeaderProps,
  CurrencyConverter,
  CurrencyConverterProps,
} from '../components';
import { countExchange, preprocessHeaderProps, returnIfNotUndefined } from '../utils';
import { getCurrencies } from '../services';

interface HomeProps {
  headerProps: HeaderProps;
  converterProps: CurrencyConverterProps;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const currencies = await getCurrencies();

  const currencyEntries = ObjEntries(currencies);

  const [firstCurrency, { rates }] = returnIfNotUndefined(currencyEntries[1], 'Something went wrong. 1363kx');
  const [secondCurrency] = returnIfNotUndefined(currencyEntries[0], 'Something went wrong. 9my5nt');

  const rate = returnIfNotUndefined(rates[secondCurrency], 'Something went wrong. vvq87w');

  const firstAmount = 1;
  const secondAmount = countExchange(firstAmount, rate);

  return {
    props: ((e: HomeProps) => e)({
      headerProps: preprocessHeaderProps(currencies),
      converterProps: {
        items: currencies,
        defaultAmounts: {
          first: firstAmount,
          second: secondAmount,
        },
        defaultCurrencies: {
          first: firstCurrency,
          second: secondCurrency,
        },
      },
    }),
  };
};

const Home: NextPage<HomeProps> = ({ headerProps, converterProps }) => (
  <>
    <Head>
      <title>Currency converter</title>
      <meta name='description' content='Currency converter' />
      <link rel='icon' href='/favicon.ico' />
    </Head>
    <Header {...headerProps} />
    <CurrencyConverter {...converterProps} />
  </>
);

export default Home;
