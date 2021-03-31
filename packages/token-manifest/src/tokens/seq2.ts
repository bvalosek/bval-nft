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
    description: 'Compute universal bias first. Trust me.',
    metadata: [{ image: 'seq2/s2-02.png' }],
    token: { ...tokenBase, tokenNumber: 11, created: '2021-01-21' },
  },
  {
    name: 'Convolver',
    description: "I don't know how it works, I just plug in the numbers",
    metadata: [{ image: 'seq2/s2-03.png' }],
    token: { ...tokenBase, tokenNumber: 12, created: '2021-01-05' },
  },
  {
    name: 'Beacon',
    description: 'Fire it up.',
    metadata: [{ image: 'seq2/s2-04.png' }],
    token: { ...tokenBase, tokenNumber: 13, created: '2020-12-30' },
  },
  {
    name: 'Resonance',
    description: 'Are you getting this? Is this supposed to be happening?',
    metadata: [{ image: 'seq2/s2-05.png' }],
    token: { ...tokenBase, tokenNumber: 14, created: '2021-01-03' },
  },
  {
    name: 'Interlink',
    description: "We're... locked. We're fucked.",
    metadata: [{ image: 'seq2/s2-06.png' }],
    token: { ...tokenBase, tokenNumber: 15, created: '2021-01-24' },
  },
  {
    name: 'Fallout',
    description: '',
    metadata: [{ image: 'seq2/s2-07.png' }],
    token: { ...tokenBase, tokenNumber: 16, created: '2020-12-25' },
  },
  {
    name: 'Siege',
    description: 'TODO',
    metadata: [{ image: 'seq2/s2-08.png' }],
    token: { ...tokenBase, tokenNumber: 17, created: '2020-01-19' },
  },
  {
    name: 'Emergence',
    description: 'TODO',
    metadata: [{ image: 'seq2/s2-09.png' }],
    token: { ...tokenBase, tokenNumber: 18, created: '2020-12-28' },
  },
  {
    name: 'Rapture',
    description: 'TODO',
    metadata: [{ image: 'seq2/s2-10.png' }],
    token: { ...tokenBase, tokenNumber: 19, created: '2021-01-04' },
  },
];
