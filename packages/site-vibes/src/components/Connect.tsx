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
        <Button onClick={() => doIt()}>connect to blockchain</Button>
      </Content>
    );
  }

  return <>{props.children}</>;
};
