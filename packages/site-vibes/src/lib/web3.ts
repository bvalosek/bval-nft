/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BigNumber, utils } from 'ethers';

export type Numberish = number | string | BigNumber;

export const toHexStringBytes = (val: Numberish, bytes = 20): string =>
  `${utils.hexZeroPad(BigNumber.from(val).toHexString(), bytes)}`;

export const currentTimestamp = (): number => Math.floor(Date.now() / 1000);

export const switchToPolygon = async (provider: any): Promise<void> => {
  await provider.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x89', // A 0x-prefixed hexadecimal chainId
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
          name: 'Matic',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://rpc-mainnet.matic.network'],
        blockExplorerUrls: ['https://polygonscan.com'],
      },
    ],
  });
};
