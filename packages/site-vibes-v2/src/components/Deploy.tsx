import React, { FunctionComponent } from 'react';
import { ContractFactory } from 'ethers';

import { Title } from './Title';
import { PageSection } from './PageSection';
import { Content } from './Content';
import { getContracts } from '../contracts';
import { useWallet } from '../hooks/wallet';
import { Button } from './Button';

import { MULTIPAY, LOCK_V2, WELLSPRING_V2 } from '@bvalosek/solidity-contracts';

export const Deploy: FunctionComponent = () => {
  const { library, registerTransactions } = useWallet();
  const contracts = getContracts();

  const multipay = async () => {
    const factory = new ContractFactory(MULTIPAY.abi, MULTIPAY.bytecode, library.getSigner());
    const contract = await factory.deploy();
    registerTransactions(contract.deployTransaction);
  };

  const lockV2 = async () => {
    const factory = new ContractFactory(LOCK_V2.abi, LOCK_V2.bytecode, library.getSigner());
    const contract = await factory.deploy();
    registerTransactions(contract.deployTransaction);
  };

  const wellspringv2 = async () => {
    const factory = new ContractFactory(WELLSPRING_V2.abi, WELLSPRING_V2.bytecode, library.getSigner());
    const contract = await factory.deploy({
      token: contracts.vibes,
      lock: contracts.lockV2,
      legacy: {
        seeder: '0x303eefedee1ba8e5d507a55465d946b2fea18583',
        nft: contracts.ssw,
        faucet: contracts.wellspring,
      },
    });
    registerTransactions(contract.deployTransaction);
  };

  return (
    <>
      <PageSection>
        <Title>Deployment</Title>
      </PageSection>
      <PageSection>
        <Content>
          <p>
            multipay:{' '}
            {contracts.multipay === '0x0' ? (
              <Button onClick={() => multipay()}>DEPLOY</Button>
            ) : (
              <code>{contracts.multipay}</code>
            )}
          </p>
          <p>
            lockV2:{' '}
            {contracts.lockV2 === '0x0' ? (
              <Button onClick={() => lockV2()}>DEPLOY</Button>
            ) : (
              <code>{contracts.lockV2}</code>
            )}
          </p>
          <p>
            wellspringV2:{' '}
            {contracts.wellspringV2 === '0x0' ? (
              <Button onClick={() => wellspringv2()}>DEPLOY</Button>
            ) : (
              <code>{contracts.lockV2}</code>
            )}
          </p>
        </Content>
      </PageSection>
    </>
  );
};