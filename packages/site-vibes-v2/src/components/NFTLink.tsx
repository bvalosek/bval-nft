import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { getContracts } from '../contracts';
import { ThemeConfig } from '../Theme';
import { NFTView } from '../web3/wellspringv2';
import { Button } from './Button';

interface Props {
  view: NFTView;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    tag: {
      color: theme.palette.foreground.dark,
    },
  };
});

export const NFTLink: FunctionComponent<Props> = ({ view }) => {
  const classes = useStyles();
  if (view.nft === getContracts().ssw) {
    return (
      <Button externalNavTo={`https://www.screensaver.world/object/${view.tokenId}`}>
        <span className={classes.tag}>ssw</span>#{view.tokenId}
      </Button>
    );
  }

  return <Button externalNavTo={`https://opensea.io/assets/matic/${view.nft}/${view.tokenId}`}>#{view.tokenId}</Button>;
};
