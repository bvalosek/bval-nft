import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { BrowserRouter } from 'react-router-dom';
import { createTheme } from './Theme';
import { WalletProvider } from './hooks/wallet';
import { Application } from './Application';
import { ProtocolProvider } from './hooks/protocol';
import { TokensProvider } from './hooks/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLibrary = (provider: any) => new Web3Provider(provider);

const Root: FunctionComponent = () => (
  <ThemeProvider theme={createTheme()}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <WalletProvider>
        <ProtocolProvider>
          <TokensProvider>
            <BrowserRouter>
              <Application />
            </BrowserRouter>
          </TokensProvider>
        </ProtocolProvider>
      </WalletProvider>
    </Web3ReactProvider>
  </ThemeProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
