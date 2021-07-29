import React, { FunctionComponent } from 'react';
import { ContractFactory } from 'ethers';

import { Title } from './Title';
import { PageSection } from './PageSection';
import { Content } from './Content';
import { getContracts } from '../contracts';
import { useWallet } from '../hooks/wallet';
import { Button } from './Button';

import { MULTIPAY } from '@bvalosek/solidity-contracts';

export const Deploy: FunctionComponent = () => {
  const { library, registerTransactions } = useWallet();
  const contracts = getContracts();

  const multipay = async () => {
    const factory = new ContractFactory(MULTIPAY.abi, MULTIPAY.bytecode, library.getSigner());
    const contract = await factory.deploy();
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
            )}{' '}
          </p>
        </Content>
      </PageSection>
    </>
  );
};
