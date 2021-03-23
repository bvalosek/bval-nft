import { Button, Text } from '@geist-ui/react';
import React, { FunctionComponent } from 'react';

import { Container } from './Container';
import { deployBVAL721 } from '../util/contract';
import { useWeb3Strict } from '../util/web3';

export const Deploy: FunctionComponent = () => {
  const { library } = useWeb3Strict();

  const deploy = async () => {
    await deployBVAL721(library.getSigner());
  };

  return (
    <Container>
      <Text h2>Deploy BVAL721</Text>
      <div>
        <Button type="success" onClick={() => deploy()}>
          Deploy Collection
        </Button>
      </div>
    </Container>
  );
};
