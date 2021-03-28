import React, { FunctionComponent } from 'react';
import { Application } from '../Application';
import { HeadTags } from '../components/HeadTags';
import { HomeHero } from '../components/HomeHero';
import { PageSection } from '../components/PageSection';
import { PageWithFooter } from '../components/PageWithFooter';

export const ContentPage: FunctionComponent = (props) => {
  return (
    <Application>
      <PageWithFooter>
        <HeadTags />
        <HomeHero />
        <PageSection>
          <pre>{JSON.stringify(props, null, 2)}</pre>
        </PageSection>
      </PageWithFooter>
    </Application>
  );
};

export default ContentPage;
