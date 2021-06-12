import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { useTokens } from '../hooks/tokens';
import { useWallet } from '../hooks/wallet';
import { computeStats } from '../lib/faucet';
import { ThemeConfig } from '../Theme';
import { Button } from './Button';
import { Connect } from './Connect';
import { Content } from './Content';
import { DecimalNumber } from './DecimalNumber';
import { PageSection } from './PageSection';
import { Stats } from './Stats';
import { Title } from './Title';
import { Vibes } from './Vibes';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {};
});

export const Wallet: FunctionComponent = () => {
  const { balance, account, trackInMetamask } = useWallet();
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
          <Title>Your VIBES</Title>
          <Connect>
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
                🖼 <strong>owned NFTs</strong>: {owned.length}
              </p>
            </Stats>
            <Title>utils</Title>
            <p>
              <Button onClick={() => track()}>
                Track <Vibes /> in MetaMask
              </Button>
            </p>
          </Connect>
        </Content>
      </PageSection>
    </>
  );
};
