import { providers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';

export const getProvider = (): JsonRpcProvider => {
  return new providers.JsonRpcProvider('https://polygon-mainnet.infura.io/v3/6a5ddbf0cff0460eb7931664d7495ef9', 137);
};

export const getEthProvider = (): JsonRpcProvider => {
  // default infura api key
  return new providers.JsonRpcProvider('https://mainnet.infura.io/v3/6a5ddbf0cff0460eb7931664d7495ef9', 1);
};
