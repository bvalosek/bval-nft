import { BigNumber } from '@ethersproject/bignumber';
import React, { FunctionComponent } from 'react';
import { DecimalNumber } from './DecimalNumber';
import { useProtocol } from '../hooks/protocol';

interface Props {
  vibes: BigNumber;
}

/** output the market price in vibes */
export const VibesPrice: FunctionComponent<Props> = ({ vibes }) => {
  const { marketView } = useProtocol();

  if (marketView === null) {
    return <>-</>;
  }

  const price = vibes.mul(marketView.vibesUsdcPrice).div(BigNumber.from(10).pow(18));

  if (price.lt(BigNumber.from(10).pow(18))) {
    return (
      <>
        $<DecimalNumber decimals={2} number={price} />
      </>
    );
  }

  return (
    <>
      $<DecimalNumber decimals={0} number={price} />
    </>
  );
};
