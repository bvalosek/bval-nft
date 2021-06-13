import { providers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';

export const getProvider = (): JsonRpcProvider => {
  return new providers.JsonRpcProvider('https://polygon-mainnet.infura.io/v3/f5c13c8ac386454ebfca4cd784f558bf', 137);
};
