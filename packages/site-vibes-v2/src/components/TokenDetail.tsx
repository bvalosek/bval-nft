import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';

import { Content } from './Content';
import { PageSection } from './PageSection';
import { Title } from './Title';

import { nftViewId } from '../web3/wellspringv2';
import { TwoPanel } from './TwoPanel';
import { Address } from './Address';
import { makeStyles } from '@material-ui/styles';
import { ThemeConfig } from '../Theme';
import { DecimalNumber } from './DecimalNumber';
import { Vibes } from './Vibes';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';
import { extractFlavorText, formatBytes } from '../lib/strings';
import { MarketPrice } from './MarketPrice';
import { Stats } from './Stats';
import { Divider } from './Divder';
import { useWallet } from '../hooks/wallet';
import { TokenCard } from './TokenCard';
import { useTokens } from '../hooks/tokens';

interface Params {
  nft: string;
  tokenId: string;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    hero: {
      display: 'flex',
      justifyContent: 'center',
      '& > div': {
        marginTop: theme.spacing(6),
      },
    },
  };
});

export const TokenDetail: FunctionComponent = () => {
  const { account } = useWallet();
  const { tokenId, nft } = useParams<Params>();
  const { tokens, getMetadata } = useTokens();
  const classes = useStyles();

  if (tokens == null) {
    return (
      <PageSection>
        <Content>
          <Title>⌛️ LOADING TOKEN</Title>
        </Content>
      </PageSection>
    );
  }

  const tokenView = tokens.find((t) => nftViewId(t) === nftViewId({ tokenId, nft }));

  if (!tokenView) {
    return (
      <PageSection>
        <Content>
          <Title>Invalid Token</Title>
          <p>⚠️ This token is not a VIBES NFT.</p>
          <ButtonGroup>
            <Button externalNavTo={`https://opensea.io/assets/matic/${nft}/${tokenId}`}>⛵️ VIEW on OpenSea</Button>
          </ButtonGroup>
        </Content>
      </PageSection>
    );
  }

  const metadata = getMetadata(tokenView);

  if (metadata == null) {
    return (
      <PageSection>
        <Content>
          <Title>⌛️ LOADING METADATA</Title>
        </Content>
      </PageSection>
    );
  }

  return (
    <>
      <PageSection>
        <div className={classes.hero}>
          <div>
            <TokenCard view={tokenView} />
          </div>
        </div>
      </PageSection>
      <PageSection>
        <Content>
          <div>
            <Title align="left">{metadata.name}</Title>
            <p>{extractFlavorText(metadata.description)}</p>
          </div>
        </Content>
      </PageSection>
      <PageSection>
        <TwoPanel>
          <div>
            <Content>
              <Stats>
                {metadata.creator && (
                  <>
                    <strong>🎨 artist:</strong>{' '}
                    <Button navTo={`/profile/${metadata.creator}/created`}>
                      <Address address={metadata.creator} />
                    </Button>
                    <br />
                  </>
                )}
                <strong>🔥 seeded by:</strong>{' '}
                <Button navTo={`/profile/${tokenView.seeder}/seeded`}>
                  <Address address={tokenView.seeder} />
                </Button>
                <br />
                <strong>🌈 collector:</strong>{' '}
                <Button navTo={`/profile/${tokenView.owner}/owned`}>
                  <Address address={tokenView.owner} />
                </Button>
                <br />
                <strong>😎 claimable:</strong>{' '}
                <DecimalNumber
                  number={tokenView.claimable}
                  decimals={3}
                  interoplate={{ dailyRate: tokenView.dailyRate, sampledAt: tokenView.sampledAt }}
                />{' '}
                <Vibes /> ($
                <MarketPrice amount={tokenView.claimable} price="vibesUsdcPrice" />)
                <br />
                <strong>💎 mining:</strong> <DecimalNumber number={tokenView.dailyRate} decimals={0} /> <Vibes /> ($
                <MarketPrice amount={tokenView.dailyRate} price="vibesUsdcPrice" decimals={2} />) / day
                <br />
                <strong>💰 value:</strong> <DecimalNumber number={tokenView.balance} decimals={0} /> <Vibes /> ($
                <MarketPrice amount={tokenView.balance} price="vibesUsdcPrice" />)
                <br />
                {metadata.media && (
                  <>
                    <strong>🖼 media:</strong> {metadata.media.mimeType} {formatBytes(metadata.media.size)}
                  </>
                )}
              </Stats>
            </Content>
          </div>
          <div>
            <Content>
              <ButtonGroup>
                <Button disabled={tokenView.owner !== account} navTo={`/claim/${tokenView.tokenId}`}>
                  😎 CLAIM <Vibes />
                </Button>
                <Button externalNavTo={`https://www.screensaver.world/object/${tokenView.tokenId}`}>
                  🌌 VIEW on screensaver
                </Button>
                <Button externalNavTo={`https://opensea.io/assets/matic/${tokenView.nft}/${tokenView.tokenId}`}>
                  ⛵️ VIEW on OpenSea
                </Button>
              </ButtonGroup>
            </Content>
          </div>
        </TwoPanel>
      </PageSection>
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
