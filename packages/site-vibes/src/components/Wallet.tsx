import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { useTokens } from '../hooks/tokens';
import { useWallet } from '../hooks/wallet';
import { getContracts } from '../lib/contracts';
import { computeStats } from '../lib/faucet';
import { ThemeConfig } from '../Theme';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Connect } from './Connect';
import { Content } from './Content';
import { DecimalNumber } from './DecimalNumber';
import { Divider } from './Divder';
import { PageSection } from './PageSection';
import { Stats } from './Stats';
import { Title } from './Title';
import { Vibes } from './Vibes';

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
  const { balance, account, trackInMetamask, transactions, pooled } = useWallet();
  const { tokens, sampledAt } = useTokens();
  const classes = useStyles();

  const track = async () => {
    await trackInMetamask();
  };

  const owned = tokens.filter((t) => t.owner === account);

  const stats = computeStats(owned);

  return (
    <>
      <PageSection>
        <Content>
          <Connect>
            <div className={classes.panel}>
              <div>
                <Title>Your Wallet</Title>
                <Stats>
                  <p>
                    🏦 <strong>balance</strong>: <DecimalNumber number={balance} decimals={0} /> <Vibes />
                    <br />
                    🤑 <strong>claimable</strong>:{' '}
                    <DecimalNumber
                      number={stats.totalClaimable}
                      interoplate={{ sampledAt, dailyRate: stats.totalDailyRate }}
                    />{' '}
                    <Vibes />
                    <br />
                    💎 <strong>net mining rate</strong>: <DecimalNumber number={stats.totalDailyRate} decimals={0} />{' '}
                    <Vibes /> / day
                    <br />
                    🏊‍♂️{' '}
                    <strong>
                      pooled{' '}
                      <Button externalNavTo={`https://quickswap.exchange/#/add/${getContracts().vibes}/ETH`}>
                        quickswap
                      </Button>
                      :{' '}
                    </strong>{' '}
                    <DecimalNumber number={pooled} decimals={0} /> <Vibes />
                    <br />
                    🖼 <strong>owned NFTs</strong>: {owned.length}
                    <br />
                    ⚡️ <strong>pending trx</strong>:{' '}
                    {transactions.length === 0
                      ? 'none'
                      : transactions.map((trx) => (
                          <Button externalNavTo={`https://polygonscan.com/tx/${trx.hash}`}>{trx.nonce}</Button>
                        ))}
                  </p>
                </Stats>
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
            <div>
              <Title>Your NFTs</Title>
            </div>
          </Connect>
        </Content>
      </PageSection>
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
