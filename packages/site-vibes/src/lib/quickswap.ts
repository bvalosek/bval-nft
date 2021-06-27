import { BigNumber, Contract } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';

import { getContracts } from './contracts';
import QUICKSWAP_POOL from './quickswap-abi.json';

export const getVibesMaticLPBalance = async (provider: JsonRpcProvider, address: string): Promise<BigNumber> => {
  const qs = new Contract(getContracts().quickswapVibesMatic, QUICKSWAP_POOL, provider);
  const balance = await qs.balanceOf(address);
  return balance;
};

interface PoolReserves {
  vibes: BigNumber;
  matic: BigNumber;
  totalSupply: BigNumber;
}

export const getVibesMaticPoolReserves = async (provider: JsonRpcProvider): Promise<PoolReserves> => {
  const qs = new Contract(getContracts().quickswapVibesMatic, QUICKSWAP_POOL, provider);
  const [{ _reserve0: matic, _reserve1: vibes }, totalSupply] = await Promise.all([qs.getReserves(), qs.totalSupply()]);
  return { matic, vibes, totalSupply };
};

export const getPooledVibes = async (provider: JsonRpcProvider, address: string): Promise<BigNumber> => {
  const [lpBalance, pool] = await Promise.all([
    getVibesMaticLPBalance(provider, address),
    getVibesMaticPoolReserves(provider),
  ]);

  return lpBalance.mul(pool.vibes).div(pool.totalSupply);
};
