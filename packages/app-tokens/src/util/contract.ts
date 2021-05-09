import { Contract, ContractFactory, Signer } from 'ethers';
import { TransactionResponse } from '@ethersproject/abstract-provider';

import { BVAL721, BVAL_WELLSPRING } from '@bvalosek/solidity-contracts';
import { SequenceCreateData, TokenMintData } from '../../../token-manifest/node_modules/@bvalosek/lib-tokens';

export const deployBVAL721 = async (signer: Signer): Promise<Contract> => {
  const factory = new ContractFactory(BVAL721.abi, BVAL721.bytecode, signer);
  const contract = await factory.deploy();
  return contract;
};

export const deployWellspring = async (signer: Signer): Promise<Contract> => {
  const factory = new ContractFactory(BVAL_WELLSPRING.abi, BVAL_WELLSPRING.bytecode, signer);
  const contract = await factory.deploy();
  return contract;
};

export const atomicMint = async (
  address: string,
  sequence: SequenceCreateData,
  tokens: TokenMintData[],
  signer: Signer
): Promise<TransactionResponse> => {
  const contract = new Contract(address, BVAL721.abi, signer);
  const resp = await contract.atomicMint(sequence, tokens);
  return resp;
};
