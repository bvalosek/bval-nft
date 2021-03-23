import { Contract, ContractFactory, Signer } from 'ethers';

import { BVAL721 } from '@bvalosek/solidity-contracts';

export const deployBVAL721 = async (signer: Signer): Promise<Contract> => {
  const factory = new ContractFactory(BVAL721.abi, BVAL721.bytecode, signer);
  const contract = await factory.deploy();
  return contract;
};
