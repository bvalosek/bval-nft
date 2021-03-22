import React, { FunctionComponent } from 'react';
import { Page } from '@geist-ui/react';
import { ConnectionInfo } from './components/ConnectionInfo';
import { MainScreen } from './components/MainScreen';

export const Application: FunctionComponent = () => {
  return (
    <>
      <Page>
        <ConnectionInfo />
        <MainScreen />
      </Page>
    </>
  );
};
