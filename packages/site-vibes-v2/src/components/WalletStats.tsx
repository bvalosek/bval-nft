import React, { FunctionComponent } from 'react';
import { useWallet } from '../hooks/wallet';
import { getContracts } from '..//contracts';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Title } from './Title';
import { Vibes } from './Vibes';
import { DecimalNumber } from './DecimalNumber';
import { Stats } from './Stats';
import { VibesPrice } from './VibesPrice';
import { TwoPanel } from './TwoPanel';

export const WalletStats: FunctionComponent = () => {
  const { accountView, trackInMetamask, transactions } = useWallet();

  return (
    <div>
      <Title>Your Wallet</Title>
      <TwoPanel>
        <div>
          <Stats>
            <p>
              🏦 <strong>balance</strong>: <DecimalNumber number={accountView.vibesBalance} decimals={0} /> <Vibes />{' '}
              <VibesPrice vibes={accountView.vibesBalance} />
              <br />
              ⚡️ <strong>pending trx</strong>:{' '}
              {transactions.length === 0
                ? 'none'
                : transactions.map((trx) => (
                    <Button externalNavTo={`https://polygonscan.com/tx/${trx.hash}`}>{trx.nonce}</Button>
                  ))}
            </p>
          </Stats>
        </div>
        <div>
          <ButtonGroup>
            <Button onClick={() => trackInMetamask()}>
              🦊 TRACK <Vibes /> in MetaMask
            </Button>
            <Button
              externalNavTo={`https://quickswap.exchange/#/swap?inputCurrency=ETH&outputCurrency=${
                getContracts().vibes
              }`}
            >
              📈 BUY <Vibes />
            </Button>
            <Button
              externalNavTo={`https://quickswap.exchange/#/swap?outputCurrency=ETH&inputCurrency=${
                getContracts().vibes
              }`}
            >
              🤑 SELL <Vibes />
            </Button>
          </ButtonGroup>
        </div>
      </TwoPanel>
    </div>
  );
};
