import { Button, Text } from '@geist-ui/react';
import React, { FunctionComponent } from 'react';

import { Container } from './Container';
import { deployBVAL721, deployBVALWellspring, useContracts } from '../util/contract';
import { useWeb3Strict } from '../util/web3';

export const Deploy: FunctionComponent = () => {
  const { library } = useWeb3Strict();
  const contracts = useContracts();

  const deployNft = async () => {
    await deployBVAL721(library.getSigner());
  };

  const deployFaucet = async () => {
    await deployBVALWellspring(library.getSigner(), contracts);
  };

  return (
    <Container>
      <Text h2>Deploy BVAL721</Text>
      <div>
        <Button type="success" onClick={() => deployNft()}>
          Deploy Collection
        </Button>
      </div>
      <Text h2>Deploy BVALWellspring</Text>
      <div>
        <Button type="success" onClick={() => deployFaucet()}>
          Deploy Faucet
        </Button>
      </div>
    </Container>
  );
};
