import React, { FunctionComponent } from 'react';
import { useTokens } from '../hooks/tokens';
import { useWallet } from '../hooks/wallet';
import { computeStats } from '../lib/faucet';
import { Connect } from './Connect';
import { Content } from './Content';
import { DecimalNumber } from './DecimalNumber';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { Tokens } from './Tokens';
import { Vibes } from './Vibes';

export const Wallet: FunctionComponent = () => {
  const { state, balance, account } = useWallet();
  const { tokens, sampledAt } = useTokens();
  const owned = tokens.filter((t) => t.owner === account);

  const stats = computeStats(owned);

  return (
    <>
      <PageSection>
        <Content>
          <Connect>
            <p>
              balance: <DecimalNumber number={balance} decimals={0} /> <Vibes />
              <br />
              claimable:{' '}
              <DecimalNumber
                number={stats.totalClaimable}
                interoplate={{ sampledAt, dailyRate: stats.totalDailyRate }}
              />{' '}
              <Vibes />
              <br />
              mining rate: <DecimalNumber number={stats.totalDailyRate} decimals={0} /> <Vibes /> / day
            </p>
            <p>collection: {owned.length} NFTs</p>
          </Connect>
        </Content>
      </PageSection>
      <PageSection maxWidth="1200px">
        <Tokens owner={account} />
      </PageSection>
    </>
  );
};
