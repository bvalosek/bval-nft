import { BigNumber } from '@ethersproject/bignumber';
import React, { FunctionComponent } from 'react';
import { DecimalNumber } from './DecimalNumber';
import { useProtocol } from '../hooks/protocol';

interface Props {
  amount: BigNumber;
  price: 'vibesUsdcPrice' | 'maticUsdcPrice' | 'vibesMaticPrice' | 'vibesMaticLpUsdcPrice';
}

export const MarketPrice: FunctionComponent<Props> = ({ amount, price }) => {
  const { marketView } = useProtocol();

  if (marketView === null) {
    return <>-</>;
  }

  const number = amount.mul(marketView[price]).div(BigNumber.from(10).pow(18));

  if (number.lt(BigNumber.from(10).pow(18))) {
    return (
      <>
        <DecimalNumber decimals={2} number={number} />
      </>
    );
  }

  return (
    <>
      <DecimalNumber decimals={0} number={number} />
    </>
  );
};
