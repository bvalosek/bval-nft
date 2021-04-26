import { CollectionSource } from '../types';
import { archDescentSequence, archDescentTokens } from './arch-descent';
import { seq2Sequence, seq2Tokens } from './seq2';
import { seq3Sequence, seq3Tokens } from './seq3';
import { seq4Sequence, seq4Tokens } from './seq4';
import { seq5Sequence, seq5Tokens } from './seq5';

export const tokens = [...archDescentTokens, ...seq2Tokens, ...seq3Tokens, ...seq4Tokens, ...seq5Tokens];

export const sequences = [archDescentSequence, seq2Sequence, seq3Sequence, seq4Sequence, seq5Sequence];

export const collections: CollectionSource[] = [
  {
    version: 1,
    name: '@bvalosek NFT Collection',
    description: 'Crypto art and tokenization experiments created by Brandon Valosek',
    externalLink: 'https://tokens.bvalosek.com',
    image: 'collection-v1.png',
  },
];
