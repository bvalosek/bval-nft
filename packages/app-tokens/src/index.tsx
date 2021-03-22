import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline, GeistProvider } from '@geist-ui/react';

import { Connection } from './Connection';
import { theme } from './Theme';
import { Application } from './Application';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLibrary = (provider: any) => new Web3Provider(provider);

const Root: FunctionComponent = () => (
  <ThemeProvider theme={theme}>
    <GeistProvider theme={{ type: 'light' }}>
      <CssBaseline />
      <Web3ReactProvider getLibrary={getLibrary}>
        <Connection>
          <Application />
        </Connection>
      </Web3ReactProvider>
    </GeistProvider>
  </ThemeProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
