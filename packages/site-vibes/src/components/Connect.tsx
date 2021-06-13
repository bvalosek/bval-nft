import React, { FunctionComponent } from 'react';
import { useWallet } from '../hooks/wallet';
import { walletPresent } from '../lib/web3';
import { Button } from './Button';
import { Content } from './Content';
import { Title } from './Title';
import { Vibes } from './Vibes';

export const Connect: FunctionComponent = (props) => {
  const { state, connect, switchToPolygon, error } = useWallet();

  const doIt = async () => {
    await connect();
    await switchToPolygon();
  };

  if (!walletPresent()) {
    return (
      <Content>
        <Title>⚠️ You Are Not On-Chain</Title>
        <p>
          <Vibes /> is a decentralized application built on the Polygon Layer 2 blockchain. Some features require a web3
          wallet.
        </p>
        <p>
          Please install <Button externalNavTo="https://metamask.io">METAMASK</Button> (browser plugin or mobile app) to
          access all parts of the site.
        </p>
      </Content>
    );
  }

  if (state !== 'ready') {
    return (
      <Content>
        <p>connect your MetaMask wallet.</p>
        <p style={{ textAlign: 'center' }}>
          <Button onClick={() => doIt()}>CONNECT</Button>
        </p>
        {error?.message && <p>🤮 error with injected web3 context: {error?.message}</p>}
      </Content>
    );
  }

  return <>{props.children}</>;
};
