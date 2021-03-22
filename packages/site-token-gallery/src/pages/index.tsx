import React, { FunctionComponent } from 'react';
import { Application } from '../Application';
import { Page } from '../components/Page';

export const HomePage: FunctionComponent = () => {
  return (
    <Application>
      <Page>
        <h1>Token Gallery</h1>
      </Page>
    </Application>
  );
};

export default HomePage;
