import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router';
import { useWallet } from '../hooks/wallet';
import { ThemeConfig } from '../Theme';
import { Address } from './Address';
import { Button } from './Button';
import { DecimalNumber } from './DecimalNumber';
import { FlashingLabel } from './FlashingLabel';
import { Vibes } from './Vibes';

const useStyles = makeStyles<ThemeConfig>(() => {
  return {
    onlyDesktop: {
      '@media(max-width: 799px)': { display: 'none' },
    },
  };
});

export const WalletButton: FunctionComponent = () => {
  const { state, connect, switchToPolygon, account, accountView, transactions, walletPresent } = useWallet();
  const history = useHistory();
  const classes = useStyles();

  if (!walletPresent()) {
    return (
      <Button onClick={() => history.push('/wallet')}>
        💀<span className={classes.onlyDesktop}> OFF-CHAIN</span>
      </Button>
    );
  }

  if (state === 'init') {
    return <Button>⌛️</Button>;
  } else if (state === 'disconnected') {
    return <Button onClick={() => connect()}>⚡️ connect</Button>;
  } else if (state === 'connected') {
    return <Button onClick={() => switchToPolygon()}>🚀 switch to polygon</Button>;
  } else if (accountView === null) {
    return <Button>⌛️</Button>;
  }

  return (
    <Button onClick={() => history.push('/wallet')}>
      <span className={classes.onlyDesktop}>
        <DecimalNumber number={accountView.vibesBalance} decimals={0} /> <Vibes /> |{' '}
      </span>
      <Address address={account} />
      {transactions.length ? (
        <span className={classes.onlyDesktop}>
          {' '}
          | <FlashingLabel label="pending trx" />
        </span>
      ) : null}
    </Button>
  );
};
