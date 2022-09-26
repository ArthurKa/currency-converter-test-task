import type { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import { colors } from '../utils';

import '../reset.css';

const GlobalStyles = createGlobalStyle`
  body {
    font-family: sans-serif;
    background-color: ${colors.body};
  }
  #__next {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
`;

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
}
