import { BigNumber, utils } from 'ethers';

// re-export
export { BigNumber } from 'ethers';

export type Numberish = number | string | BigNumber;

/** convert a thing to a BigNumber */
export const toBN = (val: Numberish): BigNumber => {
  if (typeof val === 'number' || typeof val === 'string') {
    return BigNumber.from(val);
  }
  return val;
};

/** convert a thing to a checksum-formatted address */
export const toAddress = (val: Numberish): string => utils.getAddress(toHexStringBytes(toBN(val), 20));

/** convert a thing to padding hex string */
export const toHexStringBytes = (val: Numberish, bytes = 32): string =>
  `${utils.hexZeroPad(toBN(val).toHexString(), bytes)}`;

/** keccak256 a BigNumber */
export const keccak256 = (val: Numberish): BigNumber => {
  const hash = utils.keccak256(toBN(val).toHexString());
  return toBN(hash);
};

/** number of bytes */
export const bytes = (n: number): number => n * 8;

/** throw if exp is not true */
export const assert = (exp: unknown, msg: string): void => {
  if (!Boolean(exp)) {
    throw new Error(msg);
  }
};

/** convert a numberish to a specific unit size, throwing if truncation occurs  */
export const toUint = (val: Numberish, sizeInBytes: number, label: string): BigNumber => {
  const number = toBN(val);
  assert(number.gte(0), `${label} must positive`);
  const masked = number.mask(bytes(sizeInBytes));
  assert(masked.eq(number), `${label} must fit within ${sizeInBytes} bytes`);
  return masked;
};
