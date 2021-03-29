import React, { FunctionComponent } from 'react';
import { Application } from '../Application';
import { Content } from '../components/Content';
import { HeadTags } from '../components/HeadTags';
import { MenuBar } from '../components/MenuBar';
import { PageSection } from '../components/PageSection';
import { PageWithFooter } from '../components/PageWithFooter';
import { Title } from '../components/Title';
import { usePages } from '../hooks/content';

interface Props {
  pageContext: {
    frontmatter__slug: string;
  };
}

export const ContentPage: FunctionComponent<Props> = (props) => {
  const { getPage } = usePages();
  const page = getPage(props.pageContext.frontmatter__slug);

  return (
    <Application>
      <PageWithFooter>
        <HeadTags />
        <MenuBar />
        <PageSection>
          <Title title={page.title} />
        </PageSection>
        <PageSection>
          <Content html={page.html} />
        </PageSection>
      </PageWithFooter>
    </Application>
  );
};

export default ContentPage;
