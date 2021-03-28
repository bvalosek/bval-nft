import React, { FunctionComponent } from 'react';
import { Application } from '../../Application';
import { HeadTags } from '../../components/HeadTags';
import { HomeHero } from '../../components/HomeHero';
import { PageSection } from '../../components/PageSection';
import { PageWithFooter } from '../../components/PageWithFooter';
import { useTokens } from '../../hooks/tokens';

/** details / info about a sequence */
export const TokenPage: FunctionComponent = () => {
  const tokens = useTokens();

  return (
    <Application>
      <PageWithFooter>
        <HeadTags />
        <HomeHero />
        <PageSection></PageSection>
      </PageWithFooter>
    </Application>
  );
};

export default TokenPage;
