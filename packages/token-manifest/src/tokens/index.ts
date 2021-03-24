import { CollectionSource } from '../types';
import { archDescentSequence, archDescentTokens } from './arch-descent';

export const tokens = [...archDescentTokens];

export const sequences = [archDescentSequence];

export const collections: CollectionSource[] = [
  {
    version: 1,
    name: '@bvalosek Collection',
    description: 'Dynamic NFTs and tokenization experiments created by Brandon Valosek',
    externalLink: 'https://tokens.bvalosek.com',
    image: 'collection-v1.png',
  },
];
