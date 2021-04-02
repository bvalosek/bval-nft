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
  const sequences = new Set(tokens.map((t) => t.sequence.sequenceNumber));
  const grouped = [...sequences].map((s) => tokens.filter((t) => t.sequence.sequenceNumber === s)).reverse();

  return (
    <Application>
      <HeadTags />
      <PageWithFooter>
        <HomeHero />
        {grouped.map((tokens) => (
          <>
            <PageSection>
              <h1>{tokens[0].sequence.source.name}</h1>
            </PageSection>
            <PageSection>
              <TokenGrid tokens={tokens} />
            </PageSection>
          </>
        ))}
      </PageWithFooter>
    </Application>
  );
};

export default HomePage;
