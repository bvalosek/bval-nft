import React, { FunctionComponent, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Admin } from './components/Admin';
import { Claim } from './components/Claim';
import { Featured } from './components/Featured';
import { Info } from './components/Info';
import { Page } from './components/Page';
import { TokenDetail } from './components/TokenDetail';
import { Tokens } from './components/Tokens';
import { Wallet } from './components/Wallet';
import { useNextPrimaryPage } from './hooks/app';
import { VIPs } from './components/vips';
import { SSWCancelBid } from './lib/ssw-cancel-bid';

export const Application: FunctionComponent = () => {
  const { next } = useNextPrimaryPage();
  const [primaryPage, setPrimaryPage] = useState('');

  useEffect(() => {
    const n = next();
    setPrimaryPage(n);
  }, []);

  if (!primaryPage) {
    return null;
  }

  return (
    <Page>
      <Switch>
        <Redirect exact path="/" to={primaryPage} />
        <Route exact path="/info">
          <Info />
        </Route>
        <Route path="/wallet">
          <Wallet />
        </Route>
        <Route exact path="/tokens">
          <Tokens />
        </Route>
        <Route exact path="/claim/:tokenId">
          <Claim />
        </Route>
        <Route path="/admin">
          <Admin />
        </Route>
        <Route path="/tokens/:tokenId">
          <TokenDetail />
        </Route>
        <Route path="/featured">
          <Featured />
        </Route>
        <Route path="/airdrop">
          <VIPs />
        </Route>
        <Route path="/ssw-cancel-bid">
          <SSWCancelBid />
        </Route>
      </Switch>
    </Page>
  );
};
