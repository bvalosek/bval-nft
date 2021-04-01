import { AssetType } from '@bvalosek/lib-tokens';
import { SequenceSource, TokenSource } from '../types';

const tokenBase = {
  version: 1,
  collectionVersion: 1,
  sequenceNumber: 2,
  editionTotal: 1,
  editionNumber: 1,
  minted: '2021-03-31',
  assetType: 'PNG' as AssetType,
  width: 3600,
  height: 3600,
  input: 0,
  output: 1000,
};

export const seq2Sequence: SequenceSource = {
  name: 'Cascade: Trial 717',
  sequenceNumber: 2,
  collectionVersion: 1,
  description: '',
  image: 'seq2/seq2.png',
  completed: true,
  atomic: true,
};

export const seq2Tokens: TokenSource[] = [
  {
    name: 'Anchor',
    description: 'Every cascade needs a foothold',
    metadata: [{ image: 'seq2/s2-01.png' }],
    token: { ...tokenBase, tokenNumber: 10, created: '2020-12-27' },
  },
  {
    name: 'Primer',
    description: 'Strategy: exploit flaws in spacetime encryption',
    metadata: [{ image: 'seq2/s2-02.png' }],
    token: { ...tokenBase, tokenNumber: 11, created: '2021-01-21' },
  },
  {
    name: 'Convolver',
    description: "It's just a bunch of numbers, how dangerous could it be?",
    metadata: [{ image: 'seq2/s2-03.png' }],
    token: { ...tokenBase, tokenNumber: 12, created: '2021-01-05' },
  },
  {
    name: 'Beacon',
    description: 'Quantum flames always burn the brightest',
    metadata: [{ image: 'seq2/s2-04.png' }],
    token: { ...tokenBase, tokenNumber: 13, created: '2020-12-30' },
  },
  {
    name: 'Resonance',
    description: 'Matter and energy tuned to an ancient, dying echo',
    metadata: [{ image: 'seq2/s2-05.png' }],
    token: { ...tokenBase, tokenNumber: 14, created: '2021-01-03' },
  },
  {
    name: 'Interlink',
    description: "Entanglment's locked... we're fucked",
    metadata: [{ image: 'seq2/s2-06.png' }],
    token: { ...tokenBase, tokenNumber: 15, created: '2021-01-24' },
  },
  {
    name: 'Fallout',
    description: 'With causality shredded, all one has left to do is wait',
    metadata: [{ image: 'seq2/s2-07.png' }],
    token: { ...tokenBase, tokenNumber: 16, created: '2020-12-25' },
  },
  {
    name: 'Siege',
    description: 'A Planck-scale last stand in a lonely universe',
    metadata: [{ image: 'seq2/s2-08.png' }],
    token: { ...tokenBase, tokenNumber: 17, created: '2020-01-19' },
  },
  {
    name: 'Emergence',
    description: 'The finality of singularity... all is as it was',
    metadata: [{ image: 'seq2/s2-09.png' }],
    token: { ...tokenBase, tokenNumber: 18, created: '2020-12-28' },
  },
  {
    name: 'Rapture',
    description: 'Unknowable mind, now fractured, now free',
    metadata: [{ image: 'seq2/s2-10.png' }],
    token: { ...tokenBase, tokenNumber: 19, created: '2021-01-04' },
  },
];
