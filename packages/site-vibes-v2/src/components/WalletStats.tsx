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
import { SQNCR } from './SQNCR';

export const WalletStats: FunctionComponent = () => {
  const { accountView, trackInMetamask, transactions, activeSQNCR } = useWallet();

  return (
    <div>
      <Title>Your Wallet</Title>
      <TwoPanel>
        <div>
          <Stats>
            <p>
              🏦 <strong>balance</strong>: <DecimalNumber number={accountView.vibesBalance} decimals={0} /> <Vibes />{' '}
              <VibesPrice vibes={accountView.vibesBalance} decimals={0} />
              <br />
              🏛 <strong>vote power</strong>: <DecimalNumber number={accountView.votePower} decimals={0} />
              <br />
              💰 <strong>your liquidity</strong>:{' '}
              <DecimalNumber number={accountView.vibesMaticLpBalance} decimals={0} /> LP{' '}
              <VibesPrice decimals={0} vibes={accountView.lpUnderlyingVibes.mul(2)} />
              <br />
              <strong>&nbsp;&nbsp;&nbsp;- VIBES</strong>:{' '}
              <DecimalNumber number={accountView.lpUnderlyingVibes} decimals={0} />
              <br />
              <strong>&nbsp;&nbsp;&nbsp;- MATIC</strong>:{' '}
              <DecimalNumber number={accountView.lpUnderlyingMatic} decimals={0} />
              <br />
              🎛 <strong>active SQNCR</strong>: {activeSQNCR ? <SQNCR sqncr={activeSQNCR} /> : <>(none)</>}
              <br />
              ⚡️ <strong>pending trx</strong>:{' '}
              {transactions.length === 0
                ? '(none)'
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
