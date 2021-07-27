import React, { FunctionComponent } from 'react';
import { Content } from './Content';
import { PageSection } from './PageSection';
import { Title } from './Title';

export const Home: FunctionComponent = () => {
  return (
    <>
      <PageSection>
        <Content>
          <Title>😎 Welcome to VIBES</Title>
        </Content>
      </PageSection>
    </>
  );
};
