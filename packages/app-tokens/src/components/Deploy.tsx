import { Button, Text } from '@geist-ui/react';
import React, { FunctionComponent } from 'react';

import { Container } from './Container';
import { deployBVAL721, deployBVALWellspring, deployTokenLockManager, useContracts } from '../util/contract';
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

  const deployLock = async () => {
    deployTokenLockManager(library.getSigner(), contracts.nft);
  };

  return (
    <Container>
      {/* <Text h2>Deploy BVAL721</Text>
      <div>
        <Button type="success" onClick={() => deployNft()}>
          Deploy Collection
        </Button>
      </div>
      <Text h2>Deploy TokenLockManager</Text>
      <div>
        <Button type="success" onClick={() => deployLock()}>
          Deploy Lock
        </Button>
      </div>
      <Text h2>Deploy BVALWellspring</Text>
      <div>
        <Button type="success" onClick={() => deployFaucet()}>
          Deploy Faucet
        </Button>
      </div> */}
      <Text h2>Deploy Vibes</Text>
      <div>
        <Button type="success" onClick={() => deployLock()}>
          Deploy $VIBES
        </Button>
      </div>
    </Container>
  );
};
