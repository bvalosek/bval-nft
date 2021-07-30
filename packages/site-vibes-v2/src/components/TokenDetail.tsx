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
import { Metadata, resolveMetadata } from '../lib/nft';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';
import { extractFlavorText, formatBytes } from '../lib/strings';
import { MarketPrice } from './MarketPrice';
import { Stats } from './Stats';
import { Divider } from './Divder';
import { useWallet } from '../hooks/wallet';
import { TokenCard } from './TokenCard';

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
        // maxHeight: '50vh',
      },
    },
  };
});

export const TokenDetail: FunctionComponent = () => {
  const { account } = useWallet();
  const { tokenId, nft } = useParams<Params>();
  const [tokenView, setTokenView] = useState<NFTView | null>(undefined);
  const [metadata, setMetadata] = useState<Metadata>(undefined);
  const classes = useStyles();

  const fetchToken = async () => {
    const [view] = await getNFTDetails([{ nft, tokenId }]);
    const metadata = await resolveMetadata(view);
    setTokenView(view);
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

  // if (!tokenView.isSeeded) {
  //   return (
  //     <PageSection>
  //       <Content>
  //         <Title>{metadata.name}</Title>
  //         <p>⚠️ This token is not a VIBES NFT.</p>
  //         <ButtonGroup>
  //           <Button externalNavTo={`https://opensea.io/assets/matic/${tokenView.nft}/${tokenView.tokenId}`}>
  //             ⛵️ VIEW on OpenSea
  //           </Button>
  //         </ButtonGroup>
  //       </Content>
  //     </PageSection>
  //   );
  // }

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
              <p>
                <Stats>
                  {metadata.creator && (
                    <>
                      <strong>🎨 artist:</strong> <Address address={metadata.creator} />
                      <br />
                    </>
                  )}
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
                  {metadata.media && (
                    <>
                      <strong>🖼 media:</strong> {metadata.media.mimeType} {formatBytes(metadata.media.size)}
                    </>
                  )}
                </Stats>
              </p>
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

  return <></>;
};
