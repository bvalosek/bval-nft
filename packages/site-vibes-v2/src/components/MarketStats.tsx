import React, { FunctionComponent } from 'react';
import { useWallet } from '../hooks/wallet';
import { getContracts } from '..//contracts';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Title } from './Title';
import { DecimalNumber } from './DecimalNumber';
import { Stats } from './Stats';
import { TwoPanel } from './TwoPanel';
import { MarketPrice } from './MarketPrice';

export const MarketStats: FunctionComponent = () => {
  const { marketView } = useWallet();

  return (
    <div>
      <Title>Market</Title>
      <TwoPanel>
        <div>
          <Stats>
            <p>
              📈 <strong>VIBES price</strong>: $
              <DecimalNumber number={marketView.vibesUsdcPrice} decimals={5} /> USD
              <br />
              📈 <strong>VIBES price</strong>: <DecimalNumber number={marketView.vibesMaticPrice} decimals={5} /> MATIC
              <br />
              📊 <strong>MATIC price</strong>: $<DecimalNumber number={marketView.maticUsdcPrice} decimals={2} /> USD
              <br />
              💰 <strong>total liquidity</strong>:{' '}
              <DecimalNumber number={marketView.vibesMaticPool.totalSupply} decimals={0} /> LP{' '}
              <MarketPrice amount={marketView.vibesMaticPool.vibesReserve.mul(2)} price="vibesUsdcPrice" />
              <br />
              <strong>&nbsp;&nbsp;&nbsp;- VIBES</strong>:{' '}
              <DecimalNumber number={marketView.vibesMaticPool.vibesReserve} decimals={0} />
              <br />
              <strong>&nbsp;&nbsp;&nbsp;- MATIC</strong>:{' '}
              <DecimalNumber number={marketView.vibesMaticPool.maticReserve} decimals={0} />
            </p>
          </Stats>
        </div>
        <div>
          <ButtonGroup>
            <Button externalNavTo={`https://quickswap.exchange/#/add/${getContracts().vibes}/ETH`}>
              🏊‍♀️ POOL liquidity
            </Button>
            <Button externalNavTo={`https://polygonscan.com/address/${getContracts().quickswapVibesMatic}#tokentxns`}>
              🔎 VIEW market trxs
            </Button>
            <Button externalNavTo={`https://info.quickswap.exchange/pair/${getContracts().quickswapVibesMatic}`}>
              📊 VIEW market stats
            </Button>
          </ButtonGroup>
        </div>
      </TwoPanel>
    </div>
  );
};
