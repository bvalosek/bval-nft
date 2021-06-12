import React, { FunctionComponent } from 'react';
import { useWallet } from '../hooks/wallet';
import { Button } from './Button';
import { Content } from './Content';

export const Connect: FunctionComponent = (props) => {
  const { state, connect, switchToPolygon } = useWallet();

  const doIt = async () => {
    await connect();
    await switchToPolygon();
  };

  if (state !== 'ready') {
    return (
      <Content>
        <p>Connect your MetaMask wallet.</p>
        <p style={{ textAlign: 'center' }}>
          <Button onClick={() => doIt()}>connect with MetaMask</Button>
        </p>
      </Content>
    );
  }

  return <>{props.children}</>;
};
