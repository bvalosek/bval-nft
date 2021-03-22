import { AssetType } from '@bvalosek/lib-tokens';
import { SequenceSource, TokenSource } from '../types';

const tokenBase = {
  version: 1,
  collectionNumber: 1,
  sequenceNumber: 1,
  editionTotal: 1,
  editionNumber: 1,
  minted: '2021-03-07',
  assetType: 'PNG' as AssetType,
  width: 2400,
  height: 2400,
};

export const archDescentSequence: SequenceSource = {
  name: 'ARCH DESCENT',
  sequenceNumber: 1,
  collectionNumber: 1,
  description: 'Journey Through a Fractaled Space',
  image: 'ARCH-DESCENT/ARCH-DESCENT.png',
  completed: true,
  atomic: true,
};

export const archDescentTokens: TokenSource[] = [
  {
    metadata: [
      {
        name: 'INIT SPACE',
        description: 'Descent Sequence Initiated',
        image: 'ARCH-DESCENT/INIT_SPACE.png',
      },
    ],
    token: { ...tokenBase, tokenNumber: 1, created: '2020-11-29' },
  },
  {
    metadata: [
      {
        name: 'ROTATE SET',
        description: 'Prime Vector Established',
        image: 'ARCH-DESCENT/ROTATE_SET.png',
      },
    ],
    token: { ...tokenBase, tokenNumber: 2, created: '2020-11-30' },
  },
  {
    metadata: [
      {
        name: 'REF LOCK',
        description: 'Secure Cardinality To Proceed',
        image: 'ARCH-DESCENT/REF_LOCK.png',
      },
    ],
    token: { ...tokenBase, tokenNumber: 3, created: '2020-12-01' },
  },
  {
    metadata: [
      {
        name: 'ISO BRANCH',
        description: 'Disregard Transient Emergences',
        image: 'ARCH-DESCENT/ISO_BRANCH.png',
      },
    ],
    token: { ...tokenBase, tokenNumber: 4, created: '2020-12-02' },
  },
  {
    metadata: [
      {
        name: 'OP DRIFT',
        description: 'Orthogonal Variance Within Tolerance',
        image: 'ARCH-DESCENT/OP_DRIFT.png',
      },
    ],
    token: { ...tokenBase, tokenNumber: 5, created: '2020-12-03' },
  },
  {
    metadata: [
      {
        name: 'SYNC GATE',
        description: 'Temporal Step-Down Activating',
        image: 'ARCH-DESCENT/SYNC_GATE.png',
      },
    ],
    token: { ...tokenBase, tokenNumber: 6, created: '2020-12-04' },
  },
  {
    metadata: [
      {
        name: 'LOAD CELL',
        description: 'Recursing Node Evaluation',
        image: 'ARCH-DESCENT/LOAD_CELL.png',
      },
    ],
    token: { ...tokenBase, tokenNumber: 7, created: '2020-12-05' },
  },
  {
    metadata: [
      {
        name: 'EXT KEY',
        description: 'Qualia Bitstream Secured',
        image: 'ARCH-DESCENT/EXT_KEY.png',
      },
    ],
    token: { ...tokenBase, tokenNumber: 8, created: '2020-12-06' },
  },
  {
    metadata: [
      {
        name: 'OUT PHASE',
        description: 'Prime Sequence Complete',
        image: 'ARCH-DESCENT/OUT_PHASE.png',
      },
    ],
    token: { ...tokenBase, tokenNumber: 9, created: '2020-12-07' },
  },
];
