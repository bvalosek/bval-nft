import React, { FunctionComponent, useEffect } from 'react';
import { Content } from './Content';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { getRecentTokens } from '../web3/wellspringv2';

export const Home: FunctionComponent = () => {
  const fetchTokens = async () => {
    const tokens = await getRecentTokens({ limit: 100 });
    console.log(tokens);
  };

  useEffect(() => {
    fetchTokens();
  }, []);

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
