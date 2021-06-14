import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from './Theme';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { Page } from './components/Page';
import { Hero } from './components/Hero';
import { Info } from './components/Info';
import { Menu } from './components/Menu';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Tokens } from './components/Tokens';
import { Stats } from './components/Stats';
import { TokensProvider } from './hooks/tokens';
import { TokenDetail } from './components/TokenDetail';
import { Admin } from './components/Admin';
import { NavBar } from './components/NavBar';
import { Wallet } from './components/Wallet';
import { WalletProvider } from './hooks/wallet';
import { Title } from './components/Title';
import { Divider } from './components/Divder';
import { Application } from './Application';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLibrary = (provider: any) => new Web3Provider(provider);

const Root: FunctionComponent = () => (
  <ThemeProvider theme={createTheme()}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <WalletProvider>
        <TokensProvider>
          <BrowserRouter>
            <Application />
          </BrowserRouter>
        </TokensProvider>
      </WalletProvider>
    </Web3ReactProvider>
  </ThemeProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
