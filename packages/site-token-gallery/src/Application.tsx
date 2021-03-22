import React, { FunctionComponent } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { useTokens } from './hooks/useTokens';

import { theme } from './Theme';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLibrary = (provider: any) => new Web3Provider(provider);

export const Application: FunctionComponent = (props) => {
  useTokens();
  return (
    <ThemeProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>{props.children}</Web3ReactProvider>
    </ThemeProvider>
  );
};
