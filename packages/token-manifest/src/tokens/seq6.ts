import { AssetType } from '@bvalosek/lib-tokens';
import { SequenceSource, TokenSource } from '../types';

const tokenBase = {
  version: 1,
  collectionVersion: 1,
  sequenceNumber: 6,
  editionTotal: 1,
  editionNumber: 1,
  minted: '2021-05-01',
  assetType: 'PNG' as AssetType,
  width: 3600,
  height: 3600,
  input: 0,
  output: 1000,
};

export const seq6Sequence: SequenceSource = {
  name: 'April 2021',
  description: 'Chapter four hundred twelve',
  sequenceNumber: tokenBase.sequenceNumber,
  collectionVersion: 1,
  image: 'seq6/seq6.png',
  completed: true,
  atomic: true,
};

export const seq6Tokens: TokenSource[] = [
  {
    name: 'Choice',
    description: 'Volition obscures the way',
    metadata: [{ image: 'seq6/s6-01.png' }],
    token: { ...tokenBase, tokenNumber: 27, created: '2021-04-21' },
  },
  {
    name: 'Journey',
    description: 'Guided by swirling uncertainty',
    metadata: [{ image: 'seq6/s6-02.png' }],
    token: { ...tokenBase, tokenNumber: 28, created: '2021-04-30' },
  },
  {
    name: 'Momentum',
    description: 'Accelerating to free-fall',
    metadata: [{ image: 'seq6/s6-03.png' }],
    token: { ...tokenBase, tokenNumber: 29, created: '2021-04-17' },
  },
];
