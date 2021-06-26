import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { useTokens } from '../hooks/tokens';
import { useWallet } from '../hooks/wallet';
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
  return {};
});

export const Wallet: FunctionComponent = () => {
  const { balance, account, trackInMetamask, transactions } = useWallet();
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
            <Title>Your VIBES</Title>
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
                <br />
                ⚡️ <strong>pending transactions</strong>:{' '}
                {transactions.length === 0
                  ? 'none'
                  : transactions.map((trx) => (
                      <Button externalNavTo={`https://polygonscan.com/tx/${trx.hash}`}>{trx.nonce}</Button>
                    ))}
              </p>
            </Stats>
            <Title>utils</Title>
            <ButtonGroup>
              <Button onClick={() => track()}>
                🦊 TRACK <Vibes /> in MetaMask
              </Button>
            </ButtonGroup>
          </Connect>
        </Content>
      </PageSection>
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
