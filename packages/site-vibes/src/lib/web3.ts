import { BigNumber, utils } from 'ethers';

export type Numberish = number | string | BigNumber;

export const toHexStringBytes = (val: Numberish, bytes = 20): string =>
  `${utils.hexZeroPad(BigNumber.from(val).toHexString(), bytes)}`;

export const currentTimestamp = (): number => Math.floor(Date.now() / 1000);
