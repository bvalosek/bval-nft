import { graphql } from 'gatsby';
import React, { FunctionComponent } from 'react';
import { Application } from '../Application';
import { HeadTags } from '../components/HeadTags';
import { MenuBar } from '../components/MenuBar';
import { PageWithFooter } from '../components/PageWithFooter';
import { Sequence } from '../components/Sequence';
import { SequencePageQuery } from '../../graphql-types';
import { Title } from '../components/Title';
import { PageSection } from '../components/PageSection';

interface Props {
  pageContext: {
    slug: string;
  };
  data: SequencePageQuery;
}

export const query = graphql`
  query SequencePage($slug: String) {
    sequence(slug: { eq: $slug }) {
      sequenceNumber
      slug
      remoteImage {
        # defined in hooks/tokens.ts
        ...FluidImage
      }
      source {
        name
        description
        completed
        atomic
      }
    }
  }
`;

/** details / info about a sequence */
export const SequencePage: FunctionComponent<Props> = (props) => {
  const { sequence } = props.data;
  return (
    <Application>
      <HeadTags title={sequence.source.name} description={sequence.source.description} />
      <PageWithFooter>
        <MenuBar />
        <PageSection>
          <Title title={sequence.source.name} subtitle={sequence.source.description} />
        </PageSection>
        <Sequence sequence={sequence} />
      </PageWithFooter>
    </Application>
  );
};

export default SequencePage;
