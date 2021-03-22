import { Description, Dot, Text } from '@geist-ui/react';
import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';

import { useWeb3Strict } from '../util/web3';
import { ThemeConfig } from '../Theme';
import { EthAddress } from './EthAddress';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    bar: {
      display: 'flex',
      alignItems: 'flex-start',
      '& > div': {
        padding: theme.spacing(0, 4),
      },
    },
    title: {
      fontSize: theme.spacing(10),
      flex: 1,
    },
  };
});

export const ConnectionInfo: FunctionComponent = () => {
  const { account, chainId } = useWeb3Strict();
  const classes = useStyles();
  return (
    <div className={classes.bar}>
      <div className={classes.title}>
        <Text h2>BVAL-721 Manager</Text>
      </div>
      <div>
        <Description
          title="network"
          content={<Dot type="success">{chainId === 1 ? 'mainnet' : chainId === 4 ? 'rinkeby' : 'what'}</Dot>}
        />
      </div>
      <div>
        <Description title="connected account" content={<EthAddress address={account} />} />
      </div>
    </div>
  );
};
