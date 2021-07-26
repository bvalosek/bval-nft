import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Error404 } from './components/Error404';
import { ManageSQNCRs } from './components/ManageSQNCRs';
import { MintSQNCR } from './components/MintSQNCR';
import { Page } from './components/Page';
import { SQNCRDetail } from './components/SQNCRDetails';
import { Wallet } from './components/Wallet';

export const Application: FunctionComponent = () => {
  return (
    <Page>
      <Switch>
        <Route path="/wallet">
          <Wallet />
        </Route>
        <Route exact path="/sqncr">
          <ManageSQNCRs />
        </Route>
        <Route path="/sqncr/mint">
          <MintSQNCR />
        </Route>
        <Route path="/sqncr/:tokenId">
          <SQNCRDetail />
        </Route>
        <Route path="*">
          <Error404 />
        </Route>
      </Switch>
    </Page>
  );
};
