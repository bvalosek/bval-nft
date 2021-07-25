import { BigNumber } from 'ethers';

export interface Metadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

export interface SQNCRData {
  tokenId: string;
  creator: string;
  owner: string;
  createdAt: Date;
  seed: BigNumber;
  metadata: Metadata;
  variant: 'red' | 'green' | 'blue' | 'purple';
}
