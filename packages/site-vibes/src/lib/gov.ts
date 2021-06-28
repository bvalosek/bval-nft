import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { VOTE_POWER } from '@bvalosek/solidity-contracts';
import { getContracts } from './contracts';

export const getVotePower = async (provider: JsonRpcProvider, address: string): Promise<BigNumber> => {
  const votePower = new Contract(getContracts().votePowerFacade, VOTE_POWER.abi, provider);
  const power = await votePower.getVotePower(address);
  return power;
};
