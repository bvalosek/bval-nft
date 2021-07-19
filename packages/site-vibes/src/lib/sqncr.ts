import { Contract, ContractFactory, ContractTransaction, Signer } from 'ethers';
import { DEFAULT_SHELL, SQNCR } from '@bvalosek/solidity-contracts';
import { getContracts } from './contracts';
import { getFounders } from './founders';

export const deployDefaultShell = async (signer: Signer): Promise<Contract> => {
  const factory = new ContractFactory(DEFAULT_SHELL.abi, DEFAULT_SHELL.bytecode, signer);
  const contract = await factory.deploy();
  return contract;
};

export const deploySQNCR = async (signer: Signer): Promise<Contract> => {
  const { defaultShell, vibes } = getContracts();
  const factory = new ContractFactory(SQNCR.abi, SQNCR.bytecode, signer);
  const contract = await factory.deploy({ token: vibes, defaultShell });
  return contract;
};

export const setVIPs = async (signer: Signer): Promise<ContractTransaction> => {
  const sqncr = new Contract(getContracts().sqncr, SQNCR.abi, signer);
  const trx = await sqncr.setVips(getFounders());
  return trx;
};

export const setDefaultShell = async (signer: Signer): Promise<ContractTransaction> => {
  const sqncr = new Contract(getContracts().sqncr, SQNCR.abi, signer);
  const trx = await sqncr.setDefaultMetadataResolver(getContracts().defaultShell);
  return trx;
};
