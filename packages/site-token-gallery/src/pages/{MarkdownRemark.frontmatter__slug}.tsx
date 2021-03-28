import React, { FunctionComponent } from 'react';
import { Application } from '../Application';
import { Content } from '../components/Content';
import { HeadTags } from '../components/HeadTags';
import { HomeHero } from '../components/HomeHero';
import { PageSection } from '../components/PageSection';
import { PageWithFooter } from '../components/PageWithFooter';
import { usePages } from '../hooks/content';

export const ContentPage: FunctionComponent = (props) => {
  const { pages } = usePages();
  console.log(pages);
  return (
    <Application>
      <PageWithFooter>
        <HeadTags />
        <HomeHero />
        <PageSection>
          <Content html="" />
        </PageSection>
      </PageWithFooter>
    </Application>
  );
};

export default ContentPage;
