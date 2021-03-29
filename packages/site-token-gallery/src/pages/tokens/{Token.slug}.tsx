import React, { FunctionComponent } from 'react';
import { Application } from '../../Application';
import { HeadTags } from '../../components/HeadTags';
import { HomeHero } from '../../components/HomeHero';
import { PageSection } from '../../components/PageSection';
import { PageWithFooter } from '../../components/PageWithFooter';
import { defaultMetadata, useTokens } from '../../hooks/tokens';

interface Props {
  // from gatsby filesystem API
  pageContext: { slug: string };
}

/** details / info about a sequence */
export const TokenPage: FunctionComponent<Props> = (props) => {
  const tokens = useTokens();
  const token = tokens.find((t) => t.slug === props.pageContext.slug);
  const metdata = defaultMetadata(token)

  return (
    <Application>
      <PageWithFooter>
        <HeadTags title={token.name} description={metdata.content./>
        <HomeHero />
        <PageSection></PageSection>
      </PageWithFooter>
    </Application>
  );
};

export default TokenPage;
