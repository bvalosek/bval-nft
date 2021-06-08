import { BigNumber, Contract } from 'ethers';
import { getContracts } from './contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import VIBES from '@bvalosek/solidity-contracts/deployed-contracts/VIBES-2021-06-05.json';

export const getTokenBalance = async (provider: JsonRpcProvider, address: string): Promise<BigNumber> => {
  const vibes = new Contract(getContracts().vibes, VIBES.abi, provider);
  const balance = await vibes.balanceOf(address);
  return balance;
};
