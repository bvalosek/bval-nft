import React, { FunctionComponent } from 'react';
import { Application } from '../Application';
import { HeadTags } from '../components/HeadTags';
import { HomeHero } from '../components/HomeHero';
import { PageSection } from '../components/PageSection';
import { PageWithFooter } from '../components/PageWithFooter';
import { TokenGrid } from '../components/TokenGrid';
import { useTokens } from '../hooks/tokens';

export const HomePage: FunctionComponent = () => {
  const tokens = useTokens();

  return (
    <Application>
      <HeadTags />
      <PageWithFooter>
        <HomeHero />
        <PageSection>
          <h1>Recent Tokens</h1>
          <TokenGrid tokens={[...tokens.reverse()]} />
        </PageSection>
      </PageWithFooter>
    </Application>
  );
};

export default HomePage;
