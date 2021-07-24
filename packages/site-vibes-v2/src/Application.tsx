import React, { FunctionComponent } from 'react';
import { Route } from 'react-router-dom';
import { Page } from './components/Page';
import { Wallet } from './components/Wallet';

export const Application: FunctionComponent = () => {
  return (
    <Page>
      <Route path="/wallet">
        <Wallet />
      </Route>
    </Page>
  );
};
