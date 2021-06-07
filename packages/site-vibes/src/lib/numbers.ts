import { BigNumber } from 'ethers';

export const asDecimal = (val: BigNumber, decimals = 18): [string, string] => {
  const d = val.toString();

  // zero pad
  const pad = Math.max(0, decimals - d.length);
  const zeros = new Array(pad).fill('0').join('');
  const padded = `${zeros}${d}`;

  const a = padded.slice(0, padded.length - decimals) || '0';
  const b = padded.slice(-18);

  return [a, b];
};
