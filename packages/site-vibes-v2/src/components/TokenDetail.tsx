import React, { FunctionComponent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Content } from './Content';
import { PageSection } from './PageSection';
import { Title } from './Title';

import { getNFTDetails, NFTView } from '../web3/wellspringv2';
import { TwoPanel } from './TwoPanel';
import { Address } from './Address';
import { makeStyles } from '@material-ui/styles';
import { ThemeConfig } from '../Theme';
import { DecimalNumber } from './DecimalNumber';
import { Vibes } from './Vibes';
import { MediaInfo, Metadata, resolveCreator, resolveMediaInfo, resolveMetadata } from '../lib/nft';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';
import { formatBytes } from '../lib/strings';
import { MarketPrice } from './MarketPrice';
import { Stats } from './Stats';

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
        padding: theme.spacing(4),
        marginTop: theme.spacing(6),
        maxHeight: '60vh',
      },
    },
  };
});

export const TokenDetail: FunctionComponent = () => {
  const { tokenId, nft } = useParams<Params>();
  const [tokenView, setTokenView] = useState<NFTView | null>(undefined);
  const [metadata, setMetadata] = useState<Metadata>(undefined);
  const [creator, setCreator] = useState<string>(undefined);
  const [media, setMedia] = useState<MediaInfo>(undefined);
  const classes = useStyles();

  const fetchToken = async () => {
    const [view] = await getNFTDetails([{ nft, tokenId }]);
    setTokenView(view);
    const metadata = await resolveMetadata(view.tokenUri);
    setCreator(await resolveCreator(view, metadata));
    setMedia(await resolveMediaInfo(view, metadata));
    setMetadata(metadata);
  };

  useEffect(() => {
    fetchToken();
  }, [nft, tokenId]);

  if (metadata === undefined) {
    return (
      <PageSection>
        <Content>
          {tokenView === undefined ? <Title>⌛️ LOADING TOKEN</Title> : <Title>⌛️ LOADING METADATA</Title>}
        </Content>
      </PageSection>
    );
  }

  if (!tokenView.isSeeded) {
    return (
      <PageSection>
        <Content>
          <Title>{metadata.name}</Title>
          <p>This is not a VIBES NFT</p>
          <ButtonGroup>
            <Button externalNavTo={`https://opensea.io/assets/matic/${tokenView.nft}/${tokenView.tokenId}`}>
              ⛵️ VIEW on OpenSea
            </Button>
          </ButtonGroup>
        </Content>
      </PageSection>
    );
  }

  return (
    <>
      <PageSection>
        <div className={classes.hero}>
          <div>TOKEN CARD HERE</div>
        </div>
        <TwoPanel>
          <div>
            <Content>
              <div>
                <Title align="left">{metadata.name}</Title>
                <p>hey</p>
              </div>
              <p>
                <Stats>
                  <strong>🎨 artist:</strong> <Address address={creator} />
                  <br />
                  <strong>🔥 seeded by:</strong> <Address address={tokenView.seeder} />
                  <br />
                  <strong>🌈 collector:</strong> <Address address={tokenView.owner} />
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
                  <strong>🖼 media:</strong> {media.mimeType} {formatBytes(media.size)}
                </Stats>
              </p>
            </Content>
          </div>
          <div>action</div>
        </TwoPanel>
      </PageSection>
    </>
  );

  return <></>;
};
