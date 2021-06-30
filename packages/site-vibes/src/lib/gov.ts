import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import VOTE_POWER from '@bvalosek/solidity-contracts/deployed-contracts/VotePower-2021-06-27.json';
import UNISWAP_STRATEGY from '@bvalosek/solidity-contracts/deployed-contracts/UniswapPoolStrategy-2021-06-27.json';
import { getContracts } from './contracts';

export const getVotePower = async (provider: JsonRpcProvider, address: string): Promise<BigNumber> => {
  const votePower = new Contract(getContracts().votePowerFacade, VOTE_POWER.abi, provider);
  const power = await votePower.getVotePower(address);
  return power;
};

export const getPooledVibes = async (provider: JsonRpcProvider, address: string): Promise<BigNumber> => {
  const uniswapStrategy = new Contract(getContracts().uniswapPoolStrategy, UNISWAP_STRATEGY.abi, provider);
  const power = await uniswapStrategy.getVotePower(address);
  return power;
};
