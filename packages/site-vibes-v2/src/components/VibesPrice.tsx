import { BigNumber } from '@ethersproject/bignumber';
import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { DecimalNumber } from '../../../site-vibes/src/components/DecimalNumber';
import { useWallet } from '../hooks/wallet';
import { ThemeConfig } from '../Theme';

interface Props {
  vibes: BigNumber;
  decimals?: number;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    price: {
      color: theme.palette.foreground.secondary,
    },
  };
});

export const VibesPrice: FunctionComponent<Props> = ({ vibes, decimals }) => {
  const { marketView } = useWallet();
  const classes = useStyles();

  if (marketView === null) {
    return <span className={classes.price}>-</span>;
  }

  const price = vibes.mul(marketView.vibesUsdcPrice).div(BigNumber.from(10).pow(18));

  return (
    <span className={classes.price}>
      ($
      <DecimalNumber decimals={decimals ?? 2} number={price} />)
    </span>
  );
};
