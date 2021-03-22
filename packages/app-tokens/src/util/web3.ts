import { utils } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { Web3Provider } from '@ethersproject/providers';

type ContextWithLibrary = Web3ReactContextInterface<Web3Provider> & { library: Web3Provider };

/** like useWeb3React but ensures we're connected and returns proper type */
export const useWeb3Strict = (): ContextWithLibrary => {
  const context = useWeb3React<Web3Provider>();
  if (!context.active) {
    throw new Error('no active web3 connection');
  }

  if (context.library === undefined) {
    throw new Error('missing provider library');
  }

  return context as ContextWithLibrary;
};

/** determine network name */
export const useNetworkName = (): 'mainnet' | 'rinkeby' => {
  const { chainId } = useWeb3Strict();
  switch (chainId) {
    case 1:
      return 'mainnet';
    case 4:
      return 'rinkeby';
  }
  throw new Error('invalid chain');
};

/** true if valid address */
export function isAddress(value: string | null | undefined): string | false {
  if (!value) {
    return false;
  }
  try {
    return utils.getAddress(value);
  } catch {
    return false;
  }
}
