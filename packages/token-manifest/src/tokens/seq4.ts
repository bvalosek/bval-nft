import { AssetType } from '@bvalosek/lib-tokens';
import { SequenceSource, TokenSource } from '../types';

const tokenBase = {
  version: 1,
  collectionVersion: 1,
  sequenceNumber: 4,
  editionTotal: 1,
  editionNumber: 1,
  minted: '2021-04-20',
  assetType: 'PNG' as AssetType,
  width: 3600,
  height: 3600,
  input: 0,
  output: 1000,
};

export const seq4Sequence: SequenceSource = {
  name: 'Hydroflections Pt. 1',
  description: 'Emersion',
  sequenceNumber: 4,
  collectionVersion: 1,
  image: 'seq4/seq4.png',
  completed: true,
  atomic: true,
};

export const seq4Tokens: TokenSource[] = [
  {
    name: 'Aqualiminal',
    description: 'Threshold of the infinite',
    metadata: [{ image: 'seq4/s4-01.png' }],
    token: { ...tokenBase, tokenNumber: 23, created: '2021-04-19' },
  },
];
