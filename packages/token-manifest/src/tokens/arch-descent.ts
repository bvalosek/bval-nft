import { AssetType } from '@bvalosek/lib-tokens';
import { TokenSource } from '../types';

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

export const archDescentTokens: TokenSource[] = [
  {
    name: 'INIT SPACE',
    description: 'Descent Sequence Initiated',
    image: 'ARCH-DESCENT/INT_SPACE.png',
    token: { ...tokenBase, tokenNumber: 1, created: '2020-11-29' },
  },
  {
    name: 'ROTATE SET',
    description: 'Prime Vector Established',
    image: 'ARCH-DESCENT/ROTATE_SET.png',
    token: { ...tokenBase, tokenNumber: 2, created: '2020-11-30' },
  },
  {
    ...tokenBase,
    name: 'REF LOCK',
    description: 'Secure Cardinality To Proceed',
    image: 'ARCH-DESCENT/REF_LOCK.png',
    token: { ...tokenBase, tokenNumber: 3, created: '2020-12-01' },
  },
  {
    ...tokenBase,
    name: 'ISO BRANCH',
    description: 'Disregard Transient Emergences',
    image: 'ARCH-DESCENT/ISO_BRANCH.png',
    token: { ...tokenBase, tokenNumber: 4, created: '2020-12-02' },
  },
  {
    ...tokenBase,
    name: 'OP DRIFT',
    description: 'Orthogonal Variance Within Tolerance',
    image: 'ARCH-DESCENT/OP_DRIFT.png',
    token: { ...tokenBase, tokenNumber: 5, created: '2020-12-03' },
  },
  {
    ...tokenBase,
    name: 'SYNC GATE',
    description: 'Temporal Step-Down Activating',
    image: 'ARCH-DESCENT/SYNC_GATE.png',
    token: { ...tokenBase, tokenNumber: 6, created: '2020-12-04' },
  },
  {
    ...tokenBase,
    name: 'LOAD CELL',
    description: 'Recursing Node Evaluation',
    image: 'ARCH-DESCENT/LOAD_CELL.png',
    token: { ...tokenBase, tokenNumber: 7, created: '2020-12-05' },
  },
  {
    ...tokenBase,
    name: 'EXT KEY',
    description: 'Qualia Bitstream Secured',
    image: 'ARCH-DESCENT/EXT_KEY.png',
    token: { ...tokenBase, tokenNumber: 8, created: '2020-12-06' },
  },
  {
    ...tokenBase,
    name: 'OUT PHASE',
    description: 'Prime Sequence Complete',
    image: 'ARCH-DESCENT/OUT_PHASE.png',
    token: { ...tokenBase, tokenNumber: 9, created: '2020-12-07' },
  },
];
