import { providers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';

export const getProvider = (): JsonRpcProvider => {
  return new providers.JsonRpcProvider('https://rpc-mainnet.matic.network', 137);
};

export const getEthProvider = (): JsonRpcProvider => {
  // default infura api key
  return new providers.JsonRpcProvider('https://mainnet.infura.io/v3/84842078b09946638c03157f83405213', 1);
};
