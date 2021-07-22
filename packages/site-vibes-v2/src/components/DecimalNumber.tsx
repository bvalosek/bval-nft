import { makeStyles } from '@material-ui/styles';
import { BigNumber } from 'ethers';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { ThemeConfig } from '../Theme';

interface Props {
  number?: BigNumber;
  decimals?: number;
  interoplate?: {
    dailyRate?: BigNumber;
    sampledAt?: number;
    max?: BigNumber;
  };
}

const useStyles = makeStyles<ThemeConfig>(() => {
  return {
    dec: {
      opacity: 0.5,
    },
  };
});

export const asDecimal = (val: BigNumber, decimals = 18): [string, string] => {
  const d = val.toString();

  // zero pad
  const pad = Math.max(0, decimals - d.length);
  const zeros = new Array(pad).fill('0').join('');
  const padded = `${zeros}${d}`;

  const a = padded.slice(0, padded.length - decimals) || '0';
  const b = padded.slice(-decimals);

  return [a, b];
};

export const DecimalNumber: FunctionComponent<Props> = ({ number, interoplate, decimals = 3 }) => {
  const [alpha, setAlpha] = useState(BigNumber.from(0));
  const classes = useStyles();

  const update = useCallback(() => {
    if (!interoplate || number === undefined || interoplate?.dailyRate === undefined) {
      return;
    }
    const delta = Date.now() - interoplate.sampledAt * 1000;
    const alpha = interoplate.dailyRate.mul(delta).div(1000 * 60 * 60 * 24);
    setAlpha(alpha);
  }, [interoplate, interoplate?.dailyRate, interoplate?.sampledAt]);

  useEffect(() => {
    const h = setInterval(update, 100);
    return () => clearInterval(h);
  }, [interoplate, interoplate?.dailyRate]);

  if (number == null) {
    return <>-</>;
  }

  const interoplated = number.add(alpha);
  const clamped = interoplate?.max && interoplated.gt(interoplate.max) ? interoplate.max : interoplated;

  const [a, b] = asDecimal(clamped);

  return (
    <>
      <span>{Number(a).toLocaleString('en-us')}</span>
      {decimals !== 0 && (
        <>
          <span>.</span>
          <span className={classes.dec}>{b.substr(0, decimals)}</span>
        </>
      )}
    </>
  );
};
