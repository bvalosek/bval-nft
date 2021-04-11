import React, { FunctionComponent } from 'react';
import { Application } from '../Application';
import { Content } from '../components/Content';
import { HeadTags } from '../components/HeadTags';
import { MenuBar } from '../components/MenuBar';
import { PageSection } from '../components/PageSection';
import { PageWithFooter } from '../components/PageWithFooter';
import { Title } from '../components/Title';
import { usePages } from '../hooks/content';
import { useTokens } from '../hooks/tokens';

interface Props {
  pageContext: {
    slug: string;
  };
}

export const IpfsPage: FunctionComponent<Props> = (props) => {
  const { getPage } = usePages();
  const tokens = useTokens();

  const page = getPage(props.pageContext.slug);

  // @ts-expect-error no idea why the compiler does not like flatMap here, I
  // think it has to do with the semi-gnarly type that is generated from the
  // graphql codegen for the tokens array
  const ipfsGatewayUrls = tokens.flatMap((token) => {
    return [
      ...token.metadata.flatMap((m) => [m.ipfsGatewayUrl, m.content.image]),
      ...token.metadata.flatMap((m) => m.assets.map((a) => a.ipfsGatewayUrl)),
    ];
  });
  const hashes = ipfsGatewayUrls.map((url) => url.replace(/^.*\//, ''));

  return (
    <Application>
      <PageWithFooter>
        <HeadTags />
        <MenuBar />
        <PageSection>
          <Title title={page.title} subtitle={page.subtitle} />
        </PageSection>
        <PageSection>
          <Content html={page.html} />
          <Content>
            <p>All metadata, image, and asset CIDs:</p>
            {hashes.map((h) => (
              <>
                <code key={h}>{h}</code>
                <br />
              </>
            ))}
          </Content>
        </PageSection>
      </PageWithFooter>
    </Application>
  );
};

export default IpfsPage;
