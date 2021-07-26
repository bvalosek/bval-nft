import React, { FunctionComponent } from 'react';
import { Content } from './Content';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { Vibes } from './Vibes';

export const Home: FunctionComponent = () => {
  return (
    <>
      <PageSection>
        <Content>
          <Title>
            😎 Welcome to <Vibes />
          </Title>
        </Content>
      </PageSection>
    </>
  );
};
