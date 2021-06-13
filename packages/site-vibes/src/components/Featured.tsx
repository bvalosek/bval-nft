import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { useTokens } from '../hooks/tokens';
import { ThemeConfig } from '../Theme';
import { Address } from './Address';
import { Content } from './Content';
import { Loading } from './Loading';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { TokenCard } from './TokenCard';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';
import { featuredTokenId, useNextPrimaryPage } from '../hooks/app';
import { New } from './Next';
import { Vibes } from './Vibes';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    hero: {
      maxHeight: '60vh',
      display: 'flex',
      justifyContent: 'center',
      '& div': {},
    },
  };
});

export const Featured: FunctionComponent = () => {
  const classes = useStyles();
  const { tokens, tokenMetadata } = useTokens();

  if (tokens.length === 0) {
    return (
      <PageSection>
        <Loading />
      </PageSection>
    );
  }

  const token = tokens.find((t) => t.tokenId === featuredTokenId);

  if (!token) {
    throw new Error();
  }

  const metadata = tokenMetadata[featuredTokenId];

  if (!metadata) {
    return (
      <PageSection>
        <Loading />
      </PageSection>
    );
  }

  return (
    <>
      <PageSection>
        <Title>😎 welcome to VIBES 😎</Title>
      </PageSection>
      <PageSection>
        <div className={classes.hero}>
          <div>
            <TokenCard tokenId={featuredTokenId} hideCollector hideTitle />
          </div>
        </div>
      </PageSection>
      <PageSection>
        <Content>
          <p>
            The current <Vibes /> Featured NFT is{' '}
            <strong>
              <em>{metadata.name}</em>
            </strong>
          </p>
          <p>
            🎨 artist:{' '}
            <Button onClick={() => window.open(`https://screensaver.world/created/${metadata.creator}`, '_blank')}>
              <Address address={metadata.creator} />
            </Button>
            <br />
            🌈 collector:{' '}
            <Button onClick={() => window.open(`https://screensaver.world/owned/${token.owner}`, '_blank')}>
              <Address address={token.owner} />
            </Button>
          </p>
          <ButtonGroup>
            <Button navTo="/tokens">🖼 VIEW NFTs</Button>
            <Button navTo="/info">💻 MORE INFO</Button>
          </ButtonGroup>
        </Content>
      </PageSection>
    </>
  );
};
