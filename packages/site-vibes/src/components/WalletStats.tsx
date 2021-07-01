import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { useTokens } from '../hooks/tokens';
import { useWallet } from '../hooks/wallet';
import { computeStats } from '../lib/faucet';
import { ThemeConfig } from '../Theme';
import { Button } from './Button';
import { DecimalNumber } from './DecimalNumber';
import { Stats } from './Stats';
import { Vibes } from './Vibes';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {};
});

export const WalletStats: FunctionComponent = () => {
  const { balance, account, transactions, pooled, votePower } = useWallet();
  const { tokens, sampledAt } = useTokens();
  const classes = useStyles();

  const owned = tokens.filter((t) => t.owner === account);

  const stats = computeStats(owned);

  return (
    <>
      <Stats>
        <p>
          🏦 <strong>balance</strong>: <DecimalNumber number={balance} decimals={0} /> <Vibes />
          <br />
          🤑 <strong>claimable</strong>:{' '}
          <DecimalNumber number={stats.totalClaimable} interoplate={{ sampledAt, dailyRate: stats.totalDailyRate }} />{' '}
          <Vibes />
          <br />
          🏊‍♂️ <strong>pooled liquidity</strong>: <DecimalNumber number={pooled} decimals={0} /> <Vibes />
          <br />
          🗳 <strong>vote power</strong>: <DecimalNumber number={votePower} decimals={0} />
          <br />
          🖼 <strong>owned NFTs</strong>: {owned.length}
          <br />
          💎 <strong>mining</strong>: <DecimalNumber number={stats.totalDailyRate} decimals={0} /> <Vibes /> / day
          <br />
          ⚡️ <strong>pending trx</strong>:{' '}
          {transactions.length === 0
            ? 'none'
            : transactions.map((trx) => (
                <Button externalNavTo={`https://polygonscan.com/tx/${trx.hash}`}>{trx.nonce}</Button>
              ))}
        </p>
      </Stats>
    </>
  );
};
