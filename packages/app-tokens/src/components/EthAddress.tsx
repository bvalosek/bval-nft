import React, { FunctionComponent } from 'react';
import { Tooltip, useClipboard, useToasts } from '@geist-ui/react';
import { Copy, ExternalLink } from '@geist-ui/react-icons';

import { CodeSpan } from './CodeSpan';
import { makeStyles } from '@material-ui/styles';
import { ThemeConfig } from '../Theme';
import { useWeb3Strict } from '../util/web3';
import { truncateHex } from '../util/strings';

interface Props {
  address: string;
  transaction?: boolean;
  goto?: string;
}

const useStyles = makeStyles<ThemeConfig>(() => {
  return {
    goto: { cursor: 'pointer' },
    container: {
      display: 'inline-flex',
      alignItems: 'center',
    },
  };
});

/** display an ethereum address (or transaction id) that links to etherscan */
export const EthAddress: FunctionComponent<Props> = (props) => {
  const { copy } = useClipboard();
  const { chainId } = useWeb3Strict();
  const [, setToast] = useToasts();
  const classes = useStyles();
  const isTrx = Boolean(props.transaction);

  const copyAddress = () => {
    copy(props.address);
    setToast({ text: `${isTrx ? 'Transaction' : 'Address'} copied to clipboard.` });
  };

  const goToEtherscan = () => {
    const prefix = chainId === 4 ? 'rinkeby.' : '';
    const type = isTrx ? 'tx' : 'address';
    const goto = props.goto ? `#${props.goto}` : '';
    const url = `https://${prefix}etherscan.io/${type}/${props.address}${goto}`;
    window.open(url, '_blank');
  };

  return (
    <span className={classes.container}>
      <Tooltip text={props.address}>
        <CodeSpan>{truncateHex(props.address)}</CodeSpan>
      </Tooltip>
      <Tooltip text="copy">
        <Copy className={classes.goto} size={18} onClick={copyAddress} />
      </Tooltip>
      <Tooltip text="etherscan">
        <ExternalLink className={classes.goto} size={18} onClick={goToEtherscan} />
      </Tooltip>
    </span>
  );
};
