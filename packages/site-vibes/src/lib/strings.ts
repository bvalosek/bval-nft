import { BigNumber } from 'ethers';

export const truncateHex = (hex: string | number | BigNumber, first = 4, last = 4): string => {
  const bn = BigNumber.from(hex);
  const s = bn.toHexString();

  // already short enough
  if (s.length <= 2 + first + last) {
    return s;
  }

  return `${s.slice(0, 2 + first)}…${s.slice(-last)}`;
};
