import React, { FunctionComponent } from 'react';
import { Application } from '../../Application';
import { HeadTags } from '../../components/HeadTags';
import { MenuBar } from '../../components/MenuBar';
import { PageWithFooter } from '../../components/PageWithFooter';
import { TokenInfo } from '../../components/TokenInfo';
import { useTokens } from '../../hooks/tokens';

interface Props {
  // from gatsby filesystem API
  pageContext: { slug: string };
}

/** details / info about a sequence */
export const TokenPage: FunctionComponent<Props> = (props) => {
  const tokens = useTokens();
  const token = tokens.find((t) => t.slug === props.pageContext.slug);

  return (
    <Application>
      <HeadTags
        title={token.source.name}
        description={token.source.description}
        socialImage={token.metadata[0].socialImage.childImageSharp.resize}
      />
      <PageWithFooter>
        <MenuBar />
        <TokenInfo tokenId={token.tokenId} />
      </PageWithFooter>
    </Application>
  );
};

export default TokenPage;
