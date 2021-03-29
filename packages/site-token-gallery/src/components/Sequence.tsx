import React, { FunctionComponent } from 'react';
import { GatsbySequenceData, useTokens } from '../hooks/tokens';
import { Content } from './Content';
import { PageSection } from './PageSection';
import { TokenGrid } from './TokenGrid';

interface Props {
  sequence: GatsbySequenceData;
}

export const Sequence: FunctionComponent<Props> = (props) => {
  const tokens = useTokens();
  const { sequence } = props;
  const fromSequence = tokens.filter((t) => t.sequence.slug === sequence.slug);

  return (
    <>
      <PageSection>
        <Content>
          {sequence.source.completed ? (
            <p>
              <strong>This sequence has been completed</strong>. New tokens cannot be minted for this sequence.
            </p>
          ) : (
            <p>
              <strong>This sequence has not yet been completed</strong>. There may be more tokens minted for this
              sequence in the future.
            </p>
          )}
          {sequence.source.atomic && (
            <p>
              <strong>This is an atomic sequence</strong>. All tokens in this sequence were minted (and the sequence was
              completed) in a single Ethereum transaction.
            </p>
          )}
        </Content>
      </PageSection>
      <PageSection>
        <Content>
          <h2>Tokens</h2>
        </Content>
      </PageSection>
      <PageSection>
        <TokenGrid tokens={fromSequence} />
      </PageSection>
    </>
  );
};
