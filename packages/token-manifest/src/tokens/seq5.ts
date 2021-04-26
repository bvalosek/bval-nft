import { AssetType } from '@bvalosek/lib-tokens';
import { SequenceSource, TokenSource } from '../types';

const tokenBase = {
  version: 1,
  collectionVersion: 1,
  sequenceNumber: 5,
  editionTotal: 1,
  editionNumber: 1,
  minted: '2021-04-26',
  assetType: 'PNG' as AssetType,
  width: 3600,
  height: 3600,
  input: 0,
  output: 1000,
};

export const seq5Sequence: SequenceSource = {
  name: 'Realmgate',
  description: 'Ingress',
  sequenceNumber: 5,
  collectionVersion: 1,
  image: 'seq5/seq5.png',
  completed: true,
  atomic: true,
};

export const seq5Tokens: TokenSource[] = [
  {
    name: 'Protostructure',
    description: 'Beginning a loop within time',
    metadata: [{ image: 'seq5/s5-01.png' }],
    token: { ...tokenBase, tokenNumber: 24, created: '2021-02-01' },
  },
  {
    name: 'Firmament',
    description: 'A chasm at the heart of reality',
    metadata: [{ image: 'seq5/s5-02.png' }],
    token: { ...tokenBase, tokenNumber: 25, created: '2021-02-02' },
  },
  {
    name: 'Crenellation',
    description: 'All paths captured along the curve',
    metadata: [{ image: 'seq5/s5-03.png' }],
    token: { ...tokenBase, tokenNumber: 26, created: '2021-02-23' },
  },
];
