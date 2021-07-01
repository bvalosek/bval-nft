import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { useTokens } from '../hooks/tokens';
import { useWallet } from '../hooks/wallet';
import { getContracts } from '../lib/contracts';
import { ThemeConfig } from '../Theme';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Connect } from './Connect';
import { Content } from './Content';
import { Divider } from './Divder';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { TokenTable } from './TokenTable';
import { Vibes } from './Vibes';
import { WalletStats } from './WalletStats';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    panel: {
      '@media(min-width: 800px)': {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      },
    },
  };
});

export const Wallet: FunctionComponent = () => {
  const { account, trackInMetamask } = useWallet();
  const { tokens } = useTokens();
  const classes = useStyles();

  const track = async () => {
    await trackInMetamask();
  };

  const owned = tokens.filter((t) => t.owner === account);

  return (
    <>
      <PageSection>
        <Content>
          <Connect>
            <div className={classes.panel}>
              <div>
                <Title>Your Wallet</Title>
                <WalletStats />
              </div>
              <div>
                <Title>Actions</Title>
                <ButtonGroup>
                  <Button onClick={() => track()}>
                    🦊 TRACK <Vibes /> in MetaMask
                  </Button>
                  <Button
                    externalNavTo={`https://quickswap.exchange/#/swap?inputCurrency=ETH&outputCurrency=${
                      getContracts().vibes
                    }`}
                  >
                    📈 BUY <Vibes />
                  </Button>
                  <Button
                    externalNavTo={`https://quickswap.exchange/#/swap?outputCurrency=ETH&inputCurrency=${
                      getContracts().vibes
                    }`}
                  >
                    🤑 SELL <Vibes />
                  </Button>
                  <Button externalNavTo={`https://quickswap.exchange/#/add/${getContracts().vibes}/ETH`}>
                    📊 POOL liquidity
                  </Button>
                  <Button externalNavTo={`https://screensaver.world/owned/${account}`}>🌌 VIEW SSW collection</Button>
                </ButtonGroup>
              </div>
            </div>
          </Connect>
        </Content>
      </PageSection>
      {account && (
        <>
          <PageSection>
            <div>
              <Title>Your NFTs</Title>
            </div>
            {owned.length > 0 && <TokenTable tokens={owned} />}
            {owned.length === 0 && (
              <Content>
                <p>
                  You do not own any <Vibes /> NFTs.
                </p>
              </Content>
            )}
          </PageSection>
          <PageSection>
            <Divider />
          </PageSection>
        </>
      )}
    </>
  );
};
