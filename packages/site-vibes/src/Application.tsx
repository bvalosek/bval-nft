import React, { FunctionComponent, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Admin } from './components/Admin';
import { Featured } from './components/Featured';
import { Info } from './components/Info';
import { Page } from './components/Page';
import { TokenDetail } from './components/TokenDetail';
import { Tokens } from './components/Tokens';
import { Wallet } from './components/Wallet';
import { useNextPrimaryPage } from './hooks/app';

export const Application: FunctionComponent = () => {
  const { next } = useNextPrimaryPage();
  const [primaryPage, setPrimaryPage] = useState('');

  useEffect(() => {
    const n = next();
    setPrimaryPage(n);
    console.log(n);
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
        <Route path="/admin">
          <Admin />
        </Route>
        <Route path="/tokens/:tokenId">
          <TokenDetail />
        </Route>
        <Route path="/featured">
          <Featured />
        </Route>
      </Switch>
    </Page>
  );
};
