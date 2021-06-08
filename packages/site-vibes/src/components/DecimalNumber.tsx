import { makeStyles } from '@material-ui/styles';
import { BigNumber } from 'ethers';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { asDecimal } from '../lib/numbers';
import { ThemeConfig } from '../Theme';

interface Props {
  number: BigNumber;
  decimals?: number;
  interoplate?: {
    dailyRate: BigNumber;
    sampledAt: number;
  };
}

const useStyles = makeStyles<ThemeConfig>(() => {
  return {
    dec: {
      opacity: 0.5,
    },
  };
});

export const DecimalNumber: FunctionComponent<Props> = ({ number, interoplate, decimals = 4 }) => {
  const [alpha, setAlpha] = useState(BigNumber.from(0));
  const classes = useStyles();

  const update = useCallback(() => {
    if (!interoplate) {
      return;
    }
    const delta = Date.now() - interoplate.sampledAt * 1000;
    const alpha = interoplate.dailyRate.mul(delta).div(1000 * 60 * 60 * 24);
    setAlpha(alpha);
  }, [interoplate, interoplate.dailyRate]);

  useEffect(() => {
    const h = setInterval(update, 100);
    return () => clearInterval(h);
  }, [interoplate, interoplate.dailyRate]);

  const [a, b] = asDecimal(number.add(alpha));

  return (
    <>
      <span>{Number(a).toLocaleString('en-us')}</span>
      <span>.</span>
      <span className={classes.dec}>{b.substr(0, decimals)}</span>
    </>
  );
};
