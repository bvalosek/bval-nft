import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router';
import { useWallet } from '../hooks/wallet';
import { ThemeConfig } from '../Theme';
import { Address } from './Address';
import { Button } from './Button';
import { DecimalNumber } from './DecimalNumber';
import { Vibes } from './Vibes';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    balance: {
      '@media(max-width: 799px)': {
        display: 'none',
      },
    },
  };
});

export const WalletButton: FunctionComponent = () => {
  const { state, connect, switchToPolygon, account, balance } = useWallet();
  const history = useHistory();
  const classes = useStyles();

  if (state === 'disconnected') {
    return <Button onClick={() => connect()}>connect</Button>;
  }

  if (state === 'connected') {
    return <Button onClick={() => switchToPolygon()}>switch to polygon</Button>;
  }

  return (
    <Button onClick={() => history.push('/wallet')}>
      <span className={classes.balance}>
        <DecimalNumber number={balance} decimals={0} /> <Vibes /> |{' '}
      </span>
      <Address address={account} />
    </Button>
  );
};