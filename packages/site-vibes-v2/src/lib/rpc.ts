import { providers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';

export const getProvider = (): JsonRpcProvider => {
  // return new providers.JsonRpcProvider('https://polygon-mainnet.infura.io/v3/6a5ddbf0cff0460eb7931664d7495ef9', 137);
  return new providers.JsonRpcProvider(
    'https://polygon-mainnet.g.alchemy.com/v2/jr_W_XO155rJiT34TSnq9iwA0fe5N231',
    137
  );
};

export const getEthProvider = (): JsonRpcProvider => {
  return new providers.JsonRpcProvider('https://mainnet.infura.io/v3/6a5ddbf0cff0460eb7931664d7495ef9', 1);
};
