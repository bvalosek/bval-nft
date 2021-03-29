import { AssetType } from '@bvalosek/lib-tokens';
import { SequenceSource, TokenSource } from '../types';

const tokenBase = {
  version: 1,
  collectionNumber: 1,
  sequenceNumber: 1,
  editionTotal: 1,
  editionNumber: 1,
  minted: '2021-03-28',
  assetType: 'PNG' as AssetType,
  width: 2400,
  height: 2400,
  input: 0,
  output: 1000,
};

export const archDescentSequence: SequenceSource = {
  name: 'ARCH DESCENT',
  sequenceNumber: 1,
  collectionVersion: 1,
  description: 'Journey Through a Fractaled Space',
  image: 'ARCH-DESCENT/ARCH-DESCENT.png',
  completed: true,
  atomic: true,
};

export const archDescentTokens: TokenSource[] = [
  {
    name: 'INIT SPACE',
    description: 'Descent Sequence Initiated',
    metadata: [{ image: 'ARCH-DESCENT/INIT_SPACE.png' }],
    token: { ...tokenBase, tokenNumber: 1, created: '2020-11-29' },
  },
  {
    name: 'ROTATE SET',
    description: 'Prime Vector Established',
    metadata: [{ image: 'ARCH-DESCENT/ROTATE_SET.png' }],
    token: { ...tokenBase, tokenNumber: 2, created: '2020-11-30' },
  },
  {
    name: 'REF LOCK',
    description: 'Secure Cardinality To Proceed',
    metadata: [{ image: 'ARCH-DESCENT/REF_LOCK.png' }],
    token: { ...tokenBase, tokenNumber: 3, created: '2020-12-01' },
  },
  {
    name: 'ISO BRANCH',
    description: 'Disregard Transient Emergences',
    metadata: [{ image: 'ARCH-DESCENT/ISO_BRANCH.png' }],
    token: { ...tokenBase, tokenNumber: 4, created: '2020-12-02' },
  },
  {
    name: 'OP DRIFT',
    description: 'Orthogonal Variance Within Tolerance',
    metadata: [{ name: 'OP DRIFT', image: 'ARCH-DESCENT/OP_DRIFT.png' }],
    token: { ...tokenBase, tokenNumber: 5, created: '2020-12-03' },
  },
  {
    name: 'SYNC GATE',
    description: 'Temporal Step-Down Activating',
    metadata: [{ image: 'ARCH-DESCENT/SYNC_GATE.png' }],
    token: { ...tokenBase, tokenNumber: 6, created: '2020-12-04' },
  },
  {
    name: 'LOAD CELL',
    description: 'Recursing Node Evaluation',
    metadata: [{ image: 'ARCH-DESCENT/LOAD_CELL.png' }],
    token: { ...tokenBase, tokenNumber: 7, created: '2020-12-05' },
  },
  {
    name: 'EXT KEY',
    description: 'Qualia Bitstream Secured',
    metadata: [{ image: 'ARCH-DESCENT/EXT_KEY.png' }],
    token: { ...tokenBase, tokenNumber: 8, created: '2020-12-06' },
  },
  {
    name: 'OUT PHASE',
    description: 'Prime Sequence Complete',
    metadata: [{ image: 'ARCH-DESCENT/OUT_PHASE.png' }],
    token: { ...tokenBase, tokenNumber: 9, created: '2020-12-07' },
  },
];
