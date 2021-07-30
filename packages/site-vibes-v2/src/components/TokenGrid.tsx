import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';
import { NFTView } from '../web3/wellspringv2';
import { TokenCard } from './TokenCard';

interface Props {
  views: NFTView[];
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    container: {
      display: 'grid',
      '@media(min-width: 800px)': {
        gridTemplateColumns: '1fr 1fr',
      },
      '@media(min-width: 1000px)': {
        gridTemplateColumns: '1fr 1fr 1fr',
      },
      gap: theme.scaledSpacing(10),
    },
  };
});

export const TokenGrid: FunctionComponent<Props> = ({ views }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {views.map((view) => (
        <TokenCard key={`${view.nft}:${view.tokenId}`} view={view} />
      ))}
    </div>
  );
};
