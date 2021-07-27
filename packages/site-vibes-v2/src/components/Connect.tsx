import React, { FunctionComponent } from 'react';
import { useWallet } from '../hooks/wallet';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Title } from './Title';
import { Vibes } from './Vibes';

/** only render children when connected, else display help info / wizard */
export const Connect: FunctionComponent = (props) => {
  const { state, connect, switchToPolygon, error, walletPresent, accountView } = useWallet();

  const doIt = async () => {
    await connect();
    await switchToPolygon();
  };

  if (!walletPresent()) {
    return (
      <>
        <Title>
          ⚠️ Your Browser Cannot Connect to <Vibes />
        </Title>
        <p>
          <Vibes /> is a decentralized application built on the Polygon Layer 2 blockchain. Some features require a web3
          wallet.
        </p>
        <p>
          Please install <Button externalNavTo="https://metamask.io">METAMASK</Button> (browser plugin or mobile app) to
          access <Vibes />.
        </p>
      </>
    );
  }

  if (state === 'init') {
    return <Title>⌛️ LOADING</Title>;
  }

  if (state !== 'ready') {
    return (
      <>
        <Title>🚀 Connect Your Wallet</Title>
        <p>
          <Vibes /> uses MetaMask as a web3 provider in order to communicate with the Polygon Layer 2 blockchain.
          Connect your wallet to continue.
        </p>
        <ButtonGroup>
          <Button onClick={() => doIt()}>⚡ CONNECT</Button>
        </ButtonGroup>
        {error?.message && <p>🤮 error with injected web3 context: {error?.message}</p>}
      </>
    );
  }

  if (accountView === null) {
    return <Title>⌛️ LOADING</Title>;
  }

  return <>{props.children}</>;
};
