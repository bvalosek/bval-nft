import React, { FunctionComponent } from 'react';
import { Route } from 'react-router-dom';
import { MintSQNCR } from './components/MintSQNCR';
import { Page } from './components/Page';
import { SQNCRDetail } from './components/SQNCRDetails';
import { Wallet } from './components/Wallet';

export const Application: FunctionComponent = () => {
  return (
    <Page>
      <Route path="/wallet">
        <Wallet />
      </Route>
      <Route path="/mint-sqncr">
        <MintSQNCR />
      </Route>
      <Route path="/sqncr/:tokenId">
        <SQNCRDetail />
      </Route>
    </Page>
  );
};
