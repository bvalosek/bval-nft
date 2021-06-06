import { providers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';

export const getProvider = (): JsonRpcProvider => {
  return new providers.JsonRpcProvider(
    'https://rpc-mainnet.maticvigil.com/v1/8daf80ed452893a0210cd0717073a0a8925c358e',
    137
  );
};
