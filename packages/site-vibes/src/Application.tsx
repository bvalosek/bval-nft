import React, { FunctionComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Debug } from './components/Debug';
import { Info } from './components/Info';
import { Page } from './components/Page';
import { TokenDetail } from './components/TokenDetail';
import { Tokens } from './components/Tokens';
import { Wallet } from './components/Wallet';

export const Application: FunctionComponent = () => {
  return (
    <Page>
      <Switch>
        <Redirect exact path="/" to="/tokens" />
        <Route exact path="/info">
          <Info />
        </Route>
        <Route path="/wallet">
          <Wallet />
        </Route>
        <Route exact path="/tokens">
          <Tokens />
        </Route>
        <Route path="/debug">
          <Debug />
        </Route>
        <Route path="/tokens/:tokenId">
          <TokenDetail />
        </Route>
      </Switch>
    </Page>
  );
};
