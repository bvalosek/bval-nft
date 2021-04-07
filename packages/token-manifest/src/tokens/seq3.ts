import { AssetType } from '@bvalosek/lib-tokens';
import { SequenceSource, TokenSource } from '../types';

const tokenBase = {
  version: 1,
  collectionVersion: 1,
  sequenceNumber: 3,
  editionTotal: 1,
  editionNumber: 1,
  minted: '2021-04-07',
  assetType: 'PNG' as AssetType,
  width: 3600,
  height: 3600,
  input: 0,
  output: 1000,
};

export const seq3Sequence: SequenceSource = {
  name: 'Microtransients',
  sequenceNumber: 3,
  collectionVersion: 1,
  description: 'Nothing ever matters unless it ends',
  image: 'seq3/seq3.png',
  completed: true,
  atomic: true,
};

export const seq3Tokens: TokenSource[] = [
  {
    name: 'Ego Basis',
    description: 'A brief alignment of selves',
    metadata: [{ image: 'seq3/s3-01.png' }],
    token: { ...tokenBase, tokenNumber: 20, created: '2020-12-14', height: 3417, width: 3417 },
  },
  {
    name: 'Storm Collapse',
    description: 'Emptiness follows chaos freed',
    metadata: [{ image: 'seq3/s3-02.png' }],
    token: { ...tokenBase, tokenNumber: 21, created: '2020-12-21' },
  },
  {
    name: 'Amalgam Mind',
    description: 'Shattered faceted sentience',
    metadata: [{ image: 'seq3/s3-03.png' }],
    token: { ...tokenBase, tokenNumber: 22, created: '2020-12-15' },
  },
];
