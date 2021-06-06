import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from './Theme';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { Page } from './components/Page';
import { Hero } from './components/Hero';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLibrary = (provider: any) => new Web3Provider(provider);

const Root: FunctionComponent = () => (
  <ThemeProvider theme={createTheme()}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Page>
        <Hero />
      </Page>
    </Web3ReactProvider>
  </ThemeProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
