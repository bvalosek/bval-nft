import { Contract, ContractFactory, Signer } from 'ethers';
import { TransactionResponse } from '@ethersproject/abstract-provider';

import { BVAL721, BVAL_WELLSPRING, LOCK_MANAGER, VIBES } from '@bvalosek/solidity-contracts';
import { SequenceCreateData, TokenMintData } from '@bvalosek/lib-tokens';
import { useNetworkName } from './web3';

interface Contracts {
  token: string;
  nft: string;
  lock: string;
  faucet: string;
  vibes: string;
}

export const useContracts = (): Contracts => {
  const chain = useNetworkName();
  switch (chain) {
    case 'mainnet':
      return {
        token: '0x27525344bbba0dDb182251387AEdd0Bde7d466B2',
        nft: '0x02D91986F0C2B02830bDfC022f0dA83529B78334',
        lock: '0x0',
        faucet: '0x0',
        vibes: '0x0',
      };
    case 'rinkeby':
      return {
        token: '0x6ca2B366f63730052a6dAE39981E65F0641B9DbA',
        nft: '0x826DDe34365ec31edFbEaCcC732fA6c0813eF7DA',
        lock: '0xDa55929a39993bA4c70a850489b43AeF081ac5f0',
        faucet: '0x0',
        vibes: '0x0',
      };
    case 'polygon':
      return {
        token: '0x0',
        nft: '0x0',
        lock: '0x0',
        faucet: '0x0',
        vibes: '0x0',
      };
  }
};

export const deployBVAL721 = async (signer: Signer): Promise<Contract> => {
  const factory = new ContractFactory(BVAL721.abi, BVAL721.bytecode, signer);
  const contract = await factory.deploy();
  return contract;
};

export const deployTokenLockManager = async (signer: Signer, nft: string): Promise<Contract> => {
  const factory = new ContractFactory(LOCK_MANAGER.abi, LOCK_MANAGER.bytecode, signer);
  const contract = await factory.deploy(nft);
  return contract;
};

export const deployBVALWellspring = async (signer: Signer, { nft, token }: Contracts): Promise<Contract> => {
  const factory = new ContractFactory(BVAL_WELLSPRING.abi, BVAL_WELLSPRING.bytecode, signer);
  const contract = await factory.deploy({ nft, token, lock: '0x0000000000000000000000000000000000000000' });
  return contract;
};

export const deployVibes = async (signer: Signer): Promise<Contract> => {
  const factory = new ContractFactory(VIBES.abi, VIBES.bytecode, signer);
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
