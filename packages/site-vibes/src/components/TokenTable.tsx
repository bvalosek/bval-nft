import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { useTokens } from '../hooks/tokens';
import { TokenInfo } from '../lib/faucet';
import { ThemeConfig } from '../Theme';
import { Button } from './Button';
import { DecimalNumber } from './DecimalNumber';

interface Props {
  tokens: TokenInfo[];
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    desktop: {
      '@media(max-width: 799px)': {
        display: 'none',
      },
    },
    table: {
      width: '100%',
      fontSize: theme.spacing(4),
      '@media(min-width: 800px)': { fontSize: theme.spacing(5) },
      '& tr': {
        padding: theme.spacing(1),
      },
    },
  };
});

export const TokenTable: FunctionComponent<Props> = ({ tokens: owned }) => {
  const { tokens, sampledAt, tokenMetadata } = useTokens();
  const classes = useStyles();

  return (
    <>
      <table className={classes.table}>
        <thead>
          <tr>
            <th className={classes.desktop}>object</th>
            <th>token</th>
            <th className={classes.desktop} style={{ textAlign: 'right' }}>
              staked
            </th>
            <th className={classes.desktop} style={{ textAlign: 'right' }}>
              claimed
            </th>
            <th className={classes.desktop} style={{ textAlign: 'right' }}>
              lifetime value
            </th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr>
              <td className={classes.desktop}>{t.tokenId}</td>
              <td>
                <Button navTo={`/tokens/${t.tokenId}`}>{tokenMetadata[t.tokenId]?.name ?? '-'}</Button>
              </td>
              <td style={{ textAlign: 'right' }} className={classes.desktop}>
                <DecimalNumber number={t.claimable} interoplate={{ sampledAt, dailyRate: t.dailyRate }} />
              </td>
              <td style={{ textAlign: 'right' }} className={classes.desktop}>
                <DecimalNumber number={t.totalClaimed} decimals={0} />
              </td>
              <td style={{ textAlign: 'right' }} className={classes.desktop}>
                <DecimalNumber number={t.balance} decimals={0} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
