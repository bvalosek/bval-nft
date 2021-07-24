import React, { FunctionComponent } from 'react';
import { useWallet } from '../hooks/wallet';
import { getContracts } from '..//contracts';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Title } from './Title';
import { DecimalNumber } from './DecimalNumber';
import { Stats } from './Stats';
import { TwoPanel } from './TwoPanel';

export const MarketStats: FunctionComponent = () => {
  const { marketView } = useWallet();

  return (
    <div>
      <Title>Market</Title>
      <TwoPanel>
        <div>
          <Stats>
            <p>
              📈 <strong>VIBES price</strong>: $<DecimalNumber number={marketView.vibesUsdcPrice} decimals={5} />
              <br />
              📊 <strong>MATIC price</strong>: $<DecimalNumber number={marketView.maticUsdcPrice} decimals={2} />
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
          </ButtonGroup>
        </div>
      </TwoPanel>
    </div>
  );
};
