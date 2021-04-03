import { BigNumber } from 'ethers';

export const openseaUrl = (contractAddress: string, tokenId: string): string => {
  const collection = BigNumber.from(contractAddress).toHexString();
  const token = BigNumber.from(tokenId).toString();
  return `https://opensea.io/assets/${collection}/${token}`;
};

export const etherscanUrl = (contractAddress: string, tokenId: string): string => {
  const collection = BigNumber.from(contractAddress).toHexString();
  const token = BigNumber.from(tokenId).toString();
  return `https://etherscan.io/token/${collection}?a=${token}`;
};
