import React, { FunctionComponent } from 'react';
import { Application } from '../Application';
import { HeadTags } from '../components/HeadTags';
import { HomeHero } from '../components/HomeHero';
import { PageSection } from '../components/PageSection';
import { PageWithFooter } from '../components/PageWithFooter';

export const HomePage: FunctionComponent = () => {
  return (
    <Application>
      <HeadTags />
      <PageWithFooter>
        <HomeHero />
        <PageSection>
          <h1>Token Gallery</h1>
        </PageSection>
      </PageWithFooter>
    </Application>
  );
};

export default HomePage;
