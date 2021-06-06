import { getContracts } from './contracts';
import { VIBES_WELLSPRING } from '@bvalosek/solidity-contracts';
import { Contract } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';

export interface TokenInfo {
  tokenId: string;
  owner: string;
  seedTimestamp: number;
  dailyRate: string;
  balance: string;
  claimable: string;
  lastClaimAt: number;
  isBurnt: boolean;
}

export const getTokenCount = async (provider: JsonRpcProvider): Promise<number> => {
  const faucet = new Contract(getContracts().faucetV2, VIBES_WELLSPRING.abi, provider);
  const count = await faucet.tokenCount();
  return count.toNumber();
};
