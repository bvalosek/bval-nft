import { providers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';

export const getProvider = (): JsonRpcProvider => {
  return new providers.JsonRpcProvider('https://rpc-mainnet.matic.network', 137);
};
