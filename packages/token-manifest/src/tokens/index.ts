import { CollectionSource } from '../types';
import { archDescentSequence, archDescentTokens } from './arch-descent';
import { seq2Sequence, seq2Tokens } from './seq2';

export const tokens = [...archDescentTokens, ...seq2Tokens];

export const sequences = [archDescentSequence, seq2Sequence];

export const collections: CollectionSource[] = [
  {
    version: 1,
    name: '@bvalosek NFT Collection',
    description: 'Crypto art and tokenization experiments created by Brandon Valosek',
    externalLink: 'https://tokens.bvalosek.com',
    image: 'collection-v1.png',
  },
];
