import { Button, Text } from '@geist-ui/react';
import React, { FunctionComponent } from 'react';

import { Container } from './Container';
import {
  deployBVAL721,
  deployBVALWellspring,
  deployTokenLockManager,
  deployVibes,
  deployVIBESWellspring,
  grantSeederRole,
  mintVibesTo,
  useContracts,
} from '../util/contract';
import { useWeb3Strict } from '../util/web3';

export const Deploy: FunctionComponent = () => {
  const { library, account } = useWeb3Strict();
  const contracts = useContracts();

  // const deployNft = async () => {
  //   await deployBVAL721(library.getSigner());
  // };

  const deployFaucet = async () => {
    await deployVIBESWellspring(library.getSigner(), contracts);
  };

  const grant = async () => {
    // BVAL/VIBES treasury
    await grantSeederRole(contracts.faucetV2, '0x9940D367E0596f64DbcbBd57f480359E4A2F852f', library.getSigner());
  };

  const deployLock = async () => {
    deployTokenLockManager(library.getSigner(), contracts.ssw);
  };

  const deployL2Token = async () => {
    deployVibes(library.getSigner());
  };

  return (
    <Container>
      <Text h2>Deploy Vibes</Text>
      <div>
        <Button type="success" onClick={() => deployL2Token()}>
          Deploy $VIBES
        </Button>
      </div>
      <Text h2>Mint To Treasury</Text>
      <div>
        <Button
          type="success"
          onClick={() => mintVibesTo(contracts.vibes, account, '1000000000000000000000000000', library.getSigner())}
        >
          Mint 1b VIBES
        </Button>
      </div>
      {/* <Text h2>Deploy BVAL721</Text>
      <div>
        <Button type="success" onClick={() => deployNft()}>
          Deploy Collection
        </Button>
      </div>
      */}
      {/*
      <Text h2>Deploy BVALWellspring</Text>
      <div>
        <Button type="success" onClick={() => deployFaucet()}>
          Deploy Faucet
        </Button>
      </div> */}
      <Text h2>Deploy TokenLockManager</Text>
      <div>
        <Button type="success" onClick={() => deployLock()}>
          Deploy Lock
        </Button>
      </div>
      <Text h2>Deploy VIBES Wellspring</Text>
      <div>
        <Button type="success" onClick={() => deployFaucet()}>
          Deploy Faucet
        </Button>
      </div>
      <Text h2>Grant Treasury SEEDER role</Text>
      <div>
        <Button type="success" onClick={() => grant()}>
          Grant
        </Button>
      </div>
    </Container>
  );
};
