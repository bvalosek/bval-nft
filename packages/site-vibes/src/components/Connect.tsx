import React, { FunctionComponent } from 'react';
import { useWallet } from '../hooks/wallet';
import { Button } from './Button';
import { Content } from './Content';

export const Connect: FunctionComponent = (props) => {
  const { state, connect, switchToPolygon, error } = useWallet();

  const doIt = async () => {
    await connect();
    await switchToPolygon();
  };

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
