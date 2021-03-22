import { TokenMintData } from '@bvalosek/lib-tokens';
import { TokenManifestEntry } from './types';

/** generate the data that should be used to mint tokens */
export const generateTokenMintData = (entry: TokenManifestEntry): TokenMintData => {
  return {
    tokenId: entry.tokenId,
    metadataCIDs: entry.metadata.map((m) => m.cid),
  };
};
