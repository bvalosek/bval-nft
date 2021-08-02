import React, { FunctionComponent } from 'react';
import { Content } from './Content';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { Token } from '../web3/wellspringv2';
import { TwoPanel } from './TwoPanel';
import { Vibes } from './Vibes';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';
import { TokenCard } from './TokenCard';
import { Divider } from './Divder';
import { makeStyles } from '@material-ui/styles';
import { ThemeConfig } from '../Theme';
import { TokenGrid } from './TokenGrid';
import { useTokens } from '../hooks/tokens';

const FEATURED: Token = { nft: '0x486ca491C9A0a9ACE266AA100976bfefC57A0Dd4', tokenId: '3353' };

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    cta: {
      '@media(max-width: 799px)': {
        minHeight: '70vh',
        display: 'grid',
        alignItems: 'center',
      },
    },
    hero: {
      '@media(min-width: 800px)': {
        marginTop: theme.spacing(10),
      },
    },
  };
});

export const Home: FunctionComponent = () => {
  const { tokens } = useTokens();
  const classes = useStyles();

  if (tokens === null) {
    return (
      <PageSection>
        <Content>
          <Title>⌛️ LOADING VIBES</Title>
        </Content>
      </PageSection>
    );
  }

  const featured = tokens.find((t) => t.nft === FEATURED.nft && t.tokenId === FEATURED.tokenId);
  const recent = tokens.filter((t) => t !== featured).slice(0, 6);

  return (
    <>
      <div className={classes.hero}>
        <PageSection>
          <TwoPanel alignItems="center">
            <div className={classes.cta}>
              <Content>
                <Title>😎 Welcome to VIBES</Title>
                <p>
                  <Vibes /> is a decentralized digital art collective and cryptonetwork on the Polygon blockchain.
                </p>
                <p>
                  We're a community of artists, collectors, and builders who want to ship cool stuff and make killer
                  art.
                </p>
                <ButtonGroup>
                  <Button>🌈 BROWSE ART</Button>
                  <Button>🚀 LEARN MORE</Button>
                </ButtonGroup>
                <p> </p>
              </Content>
            </div>
            <div>{featured && <TokenCard detailed view={featured} />}</div>
          </TwoPanel>
        </PageSection>
      </div>
      <PageSection>
        <Content>
          <Title>🔥 Recent VIBES NFTs</Title>
          <TokenGrid detailed views={recent} />
        </Content>
      </PageSection>
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
