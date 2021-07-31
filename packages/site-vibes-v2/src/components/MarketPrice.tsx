import { BigNumber } from 'ethers';
import React, { FunctionComponent } from 'react';
import { DecimalNumber } from './DecimalNumber';
import { useProtocol } from '../hooks/protocol';

interface Props {
  amount: BigNumber;
  decimals?: number;
  price: 'vibesUsdcPrice' | 'maticUsdcPrice' | 'vibesMaticPrice' | 'vibesMaticLpUsdcPrice';
}

export const MarketPrice: FunctionComponent<Props> = ({ amount, price, decimals }) => {
  const { protocolView } = useProtocol();

  if (protocolView === null) {
    return <>-</>;
  }

  const number = amount.mul(protocolView.quickswap[price]).div(BigNumber.from(10).pow(18));

  if (number.lt(BigNumber.from(10).pow(18).mul(100))) {
    return (
      <>
        <DecimalNumber decimals={decimals ?? 2} number={number} />
      </>
    );
  }

  return (
    <>
      <DecimalNumber decimals={decimals ?? 0} number={number} />
    </>
  );
};
